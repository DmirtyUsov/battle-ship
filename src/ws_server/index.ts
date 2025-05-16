import { WebSocketServer } from 'ws';
import { WS_PORT } from '../config';

export const wsServer = new WebSocketServer({ port: WS_PORT });

wsServer.on('listening', () =>
  console.log(`WebSocketServer is running on port: ${WS_PORT}`)
);

wsServer.on('connection', (client) => {
  console.log('connection');
  client.on('message', (data) => console.log(data));
  client.on('error', console.log);
  client.on('close', () => console.log('close'));
});
