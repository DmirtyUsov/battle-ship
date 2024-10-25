import { Command } from './command.model.js';
import { WebSocketExt } from './web-socket-ext.model.js';

export type Answer = {
  command: Command<unknown>;
  client: WebSocketExt | undefined;
};
