import { gamesDB } from '../dbs/index.js';
import {
  Answer,
  Command,
  ShipsAdd,
  Signals,
  WebSocketExt,
} from '../models/index.js';

import { makeBaseAnswerCheckCmdPlayerValidity } from './controller-guard.js';
import { startGame, turn } from './index.js';

export const addShips = (
  command: Command<ShipsAdd>,
  client: WebSocketExt,
): Answer[] => {
  const controllerSignal = Signals.ADD_SHIPS;

  const { baseResponse, isCommandValid } = makeBaseAnswerCheckCmdPlayerValidity(
    command,
    client,
    controllerSignal,
  );
  const responses = [baseResponse];

  if (!isCommandValid) {
    return responses;
  }

  const { indexPlayer, gameId, ships } = command.data;

  const game = gamesDB.get(+gameId);
  if (!game) {
    baseResponse.command.data = `Game with id ${gameId} does not exist`;
    return responses;
  }

  if (!game.checkRival(indexPlayer)) {
    baseResponse.command.data = `Game id ${gameId} does not have an indexPlayer ${indexPlayer}`;
    return responses;
  }

  if (game.setRivalShips(indexPlayer, ships)) {
    baseResponse.command.type = Signals.VOID;
  }

  if (game.checkFleetReadiness()) {
    responses.pop();
    startGame(game).forEach((response) => responses.push(response));
    turn(game).forEach((response) => responses.push(response));
  }

  return responses;
};
