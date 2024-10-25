import { playersDB, roomsDB } from '../dbs/index.js';
import {
  Answer,
  Command,
  RoomIndex,
  Signals,
  WebSocketExt,
} from '../models/index.js';
import { makeBaseAnswerCheckCmdPlayerValidity } from './controller-guard.js';
import { updateRoomState } from './index.js';

export const addUserToRoom = (
  command: Command<RoomIndex>,
  client: WebSocketExt,
): Answer[] => {
  const controllerSignal = Signals.ADD_USER_TO_ROOM;

  const { baseResponse, isCommandValid } = makeBaseAnswerCheckCmdPlayerValidity(
    command,
    client,
    controllerSignal,
  );
  const responses = [baseResponse];

  if (!isCommandValid) {
    return responses;
  }

  const playerName = client.playerName || '';

  if (playersDB.checkHasRoom(playerName)) {
    baseResponse.command.data = `Player ${playerName} already in the room`;
    return responses;
  }

  const { indexRoom } = command.data;

  const fullRoom = roomsDB.addPlayerToRoom(playerName, +indexRoom);

  if (!fullRoom) {
    baseResponse.command.data = `Room ${indexRoom} is already full or does not exist`;
    return responses;
  }

  if (fullRoom) {
    playersDB.setRoom(playerName, fullRoom.id);
  }

  return responses;
};
