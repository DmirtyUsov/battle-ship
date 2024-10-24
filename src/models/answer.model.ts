import { Command } from './command.model.js';
import { WebSocketExt } from './web-socket-with-id.model.js';

export type Answer = {
  command: Command<unknown>;
  client: WebSocketExt;
};
