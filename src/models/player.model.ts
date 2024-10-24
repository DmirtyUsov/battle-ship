import { Room, WebSocketExt } from './index.js';

export type Player = {
  name: string;
  password: string;
  client?: WebSocketExt;
  room?: Room
};
