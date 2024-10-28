import { playersDB } from '../dbs/index.js';
import { Game } from '../game.js';
import { Answer, GameStart, Signals } from '../models/index.js';

export const startGame = (game: Game): Answer[] => {
  const data = game.getGameStartData();
  const responses = data.map((item) => makeResponseForRival(item));

  return responses;
};

const makeResponseForRival = (data: GameStart): Answer => {
  const client = playersDB.getClient(data.currentPlayerIndex as string);

  const response: Answer = {
    command: {
      type: client ? Signals.START_GAME : Signals.NOT_GET_IT,
      data,
      id: 0,
    },
    client,
  };

  return response;
};
