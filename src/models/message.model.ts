import { WebSocket } from 'ws';
import { Command } from './command.model';

export type Message = {
  command: Command;
  direction: 'from' | 'to';
  client: WebSocket;
};
