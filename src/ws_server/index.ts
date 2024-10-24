import { RawData, WebSocketServer } from 'ws';
import { WS_PORT } from '../config.js';
import * as logger from '../logger.js';
import { handleDialog } from './handle-dialog.js';
import { Answer, Signals, WebSocketWithId } from '../models/index.js';

export const wsServer = new WebSocketServer({ port: +WS_PORT });

let nextClientId = 1;

wsServer.on('listening', () =>
  console.log(`WebSocketServer is running on port: ${WS_PORT}`),
);
wsServer.on('connection', (client: WebSocketWithId) => {
  client.id = nextClientId;
  nextClientId += 1;
  logger.logClientConnected(client.id);

  client.on('message', (data: RawData) => {
    logger.logClientRequest(client.id);

    const responses: Answer[] = handleDialog(client, data);

    sendAnswers(responses);
  });

  client.on('error', console.error);

  client.on('close', () => logger.logClientDisconnected(client.id));
});

wsServer.on('close', () => console.log(`Server close`, wsServer.clients.size));

const sendAnswers = (responses: Answer[]): void => {
  responses.forEach((response) => {
    const { command, client } = response;
    if (command.type === Signals.NOT_GET_IT) {
      console.error('Error:', response.command.data);
      return;
    }
    logger.logServerResponse(client.id);
    console.log(command);
    try {
      const message = JSON.stringify(command);
      client.send(message);
    } catch (error) {
      const message = (error as Error).message;
      console.error('Error', message);
    }
  });
};
