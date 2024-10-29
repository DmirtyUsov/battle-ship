import { gamesDB, playersDB } from '../dbs/index.js';
import {
  Answer,
  AttackFeedback,
  AttackParams,
  Command,
  GameOutput,
  Position,
  Signals,
  WebSocketExt,
} from '../models/index.js';
import { makeBaseAnswerCheckCmdPlayerValidity } from './controller-guard.js';
import { finish, turn, updateWinners } from './index.js';

export const attack = (
  command: Command<AttackParams>,
  client: WebSocketExt,
  isRandom: boolean = false,
): Answer[] => {
  const controllerSignal = Signals.ATTACK;

  const { baseResponse, isCommandValid } = makeBaseAnswerCheckCmdPlayerValidity(
    command,
    client,
    isRandom ? Signals.RANDOM_ATTACK : controllerSignal,
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

  if (!game.checkTurn(indexPlayer)) {
    baseResponse.command.data = `It is not ${indexPlayer} turn.`;
    return responses;
  }

  const position: Position = isRandom
    ? game.getRandomPositionForAttack(indexPlayer)
    : { x, y };

  const feedbacks: GameOutput<AttackFeedback>[] | undefined = game.attack(
    indexPlayer,
    position,
  );

  if (!feedbacks) {
    baseResponse.command.data = `No feedbacks from game.attack()`;
    return responses;
  }

  responses.pop();
  baseResponse.command.type = controllerSignal;

  feedbacks.forEach((feedback) => {
    const command = {
      ...baseResponse.command,
      data: feedback.output,
    };
    const client = playersDB.getClient(feedback.toRivalId as string);

    const response: Answer = {
      command,
      client,
    };
    responses.push(response);
  });

  if (game.checkGameOn() && game.checkGameWithBot()) {
    const botFeedbacks = game.attackByBot();
    if (botFeedbacks) {
      botFeedbacks.forEach((feedback) => {
        const command = {
          ...baseResponse.command,
          data: feedback.output,
        };
        const client = playersDB.getClient(feedback.toRivalId as string);

        const response: Answer = {
          command,
          client,
        };
        responses.push(response);
      });
    }
  }

  const isGameOver = game.checkGameOver();

  const nextMoves = isGameOver ? finish(gameId) : turn(game);
  nextMoves.forEach((response) => responses.push(response));

  if (isGameOver) {
    responses.push(updateWinners(client));
  }

  return responses;
};
