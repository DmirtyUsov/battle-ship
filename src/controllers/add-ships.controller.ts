import { gamesDB } from '../dbs/index.js';
import {
  Answer,
  Command,
  ShipsAdd,
  Signals,
  WebSocketExt,
} from '../models/index.js';

import { makeBaseAnswerCheckCmdPlayerValidity } from './controller-guard.js';

export const addShips = (
  command: Command<ShipsAdd>,
  client: WebSocketExt,
): Answer => {
  const controllerSignal = Signals.ADD_SHIPS;

  const { baseResponse, isCommandValid } = makeBaseAnswerCheckCmdPlayerValidity(
    command,
    client,
    controllerSignal,
  );

  if (!isCommandValid) {
    return baseResponse;
  }

  const response = baseResponse;

  const { indexPlayer, gameId, ships } = command.data;

  const game = gamesDB.get(+gameId);
  if (!game) {
    response.command.data = `Game with id ${gameId} does not exist`;
    return baseResponse;
  }

  if (!game.checkRival(indexPlayer)) {
    response.command.data = `Game id ${gameId} does not have an indexPlayer ${indexPlayer}`;
    return baseResponse;
  }

  if (game.setRivalShips(indexPlayer, ships)) {
    response.command.type = Signals.VOID;
  }

  return response;
};
