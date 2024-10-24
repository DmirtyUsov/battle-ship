import { WebSocketExt } from './web-socket-with-id.model.js';

export type Player = {
  name: string;
  password: string;
  client?: WebSocketExt;
};
