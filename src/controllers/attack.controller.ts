import { gamesDB, playersDB } from '../dbs/index.js';
import {
  Answer,
  AttackFeedback,
  AttackParams,
  Command,
  Position,
  Signals,
  WebSocketExt,
} from '../models/index.js';
import { makeBaseAnswerCheckCmdPlayerValidity } from './controller-guard.js';
import { turn } from './turn.controller.js';

export const attack = (
  command: Command<AttackParams>,
  client: WebSocketExt,
): Answer[] => {
  const controllerSignal = Signals.ATTACK;

  const { baseResponse, isCommandValid } = makeBaseAnswerCheckCmdPlayerValidity(
    command,
    client,
    controllerSignal,
  );
  const responses = [baseResponse];

  if (!isCommandValid) {
    return responses;
  }

  const { indexPlayer, gameId, x, y } = command.data;

  const game = gamesDB.get(+gameId);
  if (!game) {
    baseResponse.command.data = `Game with id ${gameId} does not exist`;
    return responses;
  }

  if (!game.checkRival(indexPlayer)) {
    baseResponse.command.data = `Game id ${gameId} does not have an indexPlayer ${indexPlayer}`;
    return responses;
  }

  const position: Position = { x, y };

  if (!game.checkTurn(indexPlayer)) {
    baseResponse.command.data = `It is not ${indexPlayer} turn.`;
    return responses;
  }

  const feedbacks: AttackFeedback[] | undefined = game.attack(
    indexPlayer,
    position,
  );

  if (!feedbacks) {
    return responses;
  }

  responses.pop();
  baseResponse.command.type = controllerSignal;
  const victimClient = playersDB.getClient(
    game.getRival(indexPlayer) as string,
  );

  feedbacks.forEach((feedback) => {
    const commandToAttacker = {
      ...baseResponse.command,
      data: { ...feedback },
    };
    const commandToVictim = {
      ...baseResponse.command,
      data: { ...feedback },
    };
    const responseToVictim: Answer = {
      command: commandToVictim,
      client: victimClient,
    };
    const responseToAttacker: Answer = { command: commandToAttacker, client };
    responses.push(responseToAttacker);
    responses.push(responseToVictim);
  });

  turn(game).forEach((response) => responses.push(response));

  return responses;
};
