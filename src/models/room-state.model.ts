import { RoomUser } from './index.js';

export type RoomState = {
  roomId: number | string;
  roomUsers: RoomUser[];
};
