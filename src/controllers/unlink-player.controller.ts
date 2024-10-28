import { playersDB, roomsDB } from '../dbs/index.js';
import { Answer, WebSocketExt } from '../models/index.js';
import { finish } from './index.js';
import { updateRoomState } from './update-room-state.controller.js';

export const unlinkPlayer = (client: WebSocketExt): Answer[] => {
  const responses: Answer[] = [];

  if (client.playerName === undefined) {
    return responses;
  }

  const { playerName = '' } = client;
  client.playerName = undefined;

  if (!playersDB.checkExists(playerName)) {
    return responses;
  }

  const player = playersDB.setClient(playerName, undefined);

  if (player && player.gameId) {
    const finishResponses = finish(player.gameId, player.name, true);
    finishResponses.forEach((response) => responses.push(response));
  }

  if (player && player.roomId) {
    playersDB.setRoom(playerName, undefined);
    roomsDB.delete(player.roomId);
  }

  const broadcast = updateRoomState(client);
  responses.push(broadcast);
  return responses;
};
