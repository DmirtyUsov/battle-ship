import { RoomUser } from './room-user.model';

export type RoomState = {
  roomId: string | number;
  roomUsers: RoomUser[];
};
