import { roomsDB } from '../dbs/index.js';
import { Answer, Signals, WebSocketExt } from '../models/index.js';

export const updateRoomState = (client: WebSocketExt): Answer => {
  const data = roomsDB.getRoomsSinglePlayer();

  const response: Answer = {
    command: {
      type: Signals.UPDATE_ROOM,
      data,
      id: 0,
    },
    client,
  };

  return response;
};
