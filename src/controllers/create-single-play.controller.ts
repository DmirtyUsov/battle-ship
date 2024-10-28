import { BOT_ID } from '../config.js';
import { gamesDB, playersDB, roomsDB } from '../dbs/index.js';
import {
  Answer,
  Command,
  GameCreate,
  Signals,
  WebSocketExt,
} from '../models/index.js';
import { makeBaseAnswerCheckCmdPlayerValidity } from './controller-guard.js';

export const createSinglePlay = (
  command: Command<string>,
  client: WebSocketExt,
): Answer => {
  const controllerSignal = Signals.SINGLE_PLAY;

  const { baseResponse, isCommandValid } = makeBaseAnswerCheckCmdPlayerValidity(
    command,
    client,
    controllerSignal,
  );

  if (!isCommandValid) {
    return baseResponse;
  }

  let response = baseResponse;

  const playerName = client.playerName || '';

  if (playersDB.checkHasRoom(playerName)) {
    response.command.data = `Player ${playerName} already in the room. Can not play single`;
    return response;
  }

  const newRoom = roomsDB.add(playerName);

  if (!newRoom) {
    return response;
  }

  playersDB.setRoom(playerName, newRoom.id);

  const fullRoom = roomsDB.addPlayerToRoom(BOT_ID, newRoom.id);
  if (!fullRoom) {
    baseResponse.command.data = `Single Room ${newRoom.id} is already full or does not exist`;
    return response;
  }

  const gameId = gamesDB.createGameForRoom(fullRoom);
  playersDB.setGame(playerName, gameId);
  const game = gamesDB.get(+gameId);
  game.setBotShips(BOT_ID);

  const gameCreate: GameCreate = {
    idGame: gameId,
    idPlayer: playerName,
  };

  response = {
    command: {
      type: client ? Signals.CREATE_GAME : Signals.NOT_GET_IT,
      data: gameCreate,
      id: 0,
    },
    client,
  };

  return response;
};
