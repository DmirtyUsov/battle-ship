import { RawData, WebSocketServer } from 'ws';
import { WS_PORT } from '../config.js';
import * as logger from '../logger.js';
import { handleDialog } from './handle-dialog.js';
import { Answer, Signals, WebSocketExt } from '../models/index.js';
import { unlinkPlayer } from '../controllers/unlink-player.controller.js';

export const wsServer = new WebSocketServer({ port: +WS_PORT });

let nextClientId = 1;

wsServer.on('listening', () =>
  console.log(`WebSocketServer is running on port: ${WS_PORT}`),
);
wsServer.on('connection', (client: WebSocketExt) => {
  client.id = nextClientId;
  nextClientId += 1;
  logger.logClientConnected(client.id);

  client.on('message', (data: RawData) => {
    logger.logClientRequest(client.id);

    const responses: Answer[] = handleDialog(client, data);

    sendAnswers(responses);
  });

  client.on('error', console.error);

  client.on('close', () => {
    logger.logClientDisconnected(client.id);
    const response = unlinkPlayer(client);
    if (response) {
      sendAnswers([response]);
    }
  });
});

wsServer.on('close', () => console.log(`Server close`, wsServer.clients.size));

const commandsToAll = [Signals.UPDATE_ROOM];

const sendAnswers = (responses: Answer[]): void => {
  responses.forEach((response) => {
    const { command, client } = response;

    if (command.type === Signals.NOT_GET_IT) {
      console.error('Server Error:', response.command.data);
      return;
    }

    const clientsList = commandsToAll.includes(command.type)
      ? wsServer.clients
      : [client];

    try {
      const data = JSON.stringify(command.data);
      command.data = data;
      const message = JSON.stringify(command);
      for (const dstClient of clientsList) {
        const client = dstClient as WebSocketExt;
        logger.logServerResponse(client.id);
        client.send(message);
      }
      console.log(command);
    } catch (error) {
      const message = (error as Error).message;
      console.error('Send Error', message);
    }
  });
};
