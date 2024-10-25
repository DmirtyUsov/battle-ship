import { playersDB, roomsDB } from '../dbs/index.js';
import { Answer, WebSocketExt } from '../models/index.js';
import { updateRoomState } from './update-room-state.controller.js';

export const unlinkPlayer = (client: WebSocketExt): Answer | null => {
  if (client.playerName === undefined) {
    return null;
  }

  const { playerName = '' } = client;
  client.playerName = undefined;

  if (!playersDB.checkExists(playerName)) {
    return null;
  }

  const player = playersDB.setClient(playerName, undefined);

  if (player && player.roomId) {
    playersDB.setRoom(playerName, undefined);
    roomsDB.delete(player.roomId);
  }
  const response = updateRoomState(client);
  return response;
};
