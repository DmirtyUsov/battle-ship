import { Command } from './command.model';
import { WebSocketClient } from './web-socket-client.model';

export type Message = {
  command: Command;
  direction: 'from' | 'to';
  client: WebSocketClient;
};
