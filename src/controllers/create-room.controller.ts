import { playersDB, roomsDB } from '../dbs/index.js';
import { Answer, Command, Signals, WebSocketExt } from '../models/index.js';
import { makeBaseAnswerCheckCmdPlayerValidity } from './controller-guard.js';

export const createRoom = (
  command: Command<string>,
  client: WebSocketExt,
): Answer => {
  const controllerSignal = Signals.CREATE_ROOM;

  const { baseResponse, isCommandValid } = makeBaseAnswerCheckCmdPlayerValidity(
    command,
    client,
    controllerSignal,
  );

  if (!isCommandValid) {
    return baseResponse;
  }

  const response = baseResponse;

  const playerName = client.playerName || '';

  if (playersDB.checkHasRoom(playerName)) {
    response.command.data = `Player ${playerName} already in the room`;
    return response;
  }

  const newRoom = roomsDB.add(playerName);
  if (newRoom) {
    playersDB.setRoom(playerName, newRoom.id);
    response.command.type = Signals.VOID;
  }

  return response;
};
