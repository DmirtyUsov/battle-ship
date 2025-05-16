import { RawData, WebSocketServer } from 'ws';
import { WS_PORT } from '../config';
import { handleDialog } from './handle-dialog';
import { Command, CommandType, Message } from '../models';

export const wsServer = new WebSocketServer({ port: WS_PORT });

wsServer.on('listening', () =>
  console.log(`WebSocketServer is running on port: ${WS_PORT}`)
);

wsServer.on('connection', (client) => {
  const command: Command = {
    type: CommandType.ON_CONNECTION,
    id: 0,
    data: 'Connected',
  };
  const message: Message = { command, client, direction: 'from' };
  handleDialog(message);

  client.on('message', (rawData: RawData) => {
    const command = parseRawData(rawData);
    const message: Message = { command, client, direction: 'from' };
    handleDialog(message);
  });

  client.on('error', console.log);

  client.on('close', () => {
    const command: Command = {
      type: CommandType.ON_CLOSE,
      id: 0,
      data: 'Closed',
    };
    const message: Message = { command, client, direction: 'from' };
    handleDialog(message);
  });
});

const parseRawData = (rawData: RawData): Command => {
  try {
    const command: Command = JSON.parse(rawData.toString());
    return command;
  } catch (error) {
    const message = (error as Error).message;
    const command: Command = {
      type: CommandType.NOT_GET_IT,
      id: 0,
      data: message,
    };
    return command;
  }
};
