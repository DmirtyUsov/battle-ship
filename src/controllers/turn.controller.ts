import { playersDB } from '../dbs/index.js';
import { Game } from '../game.js';
import { Answer, Signals } from '../models/index.js';

export const turn = (game: Game): Answer[] => {
  const responses: Answer[] = [];

  const data = game.turn();
  const rivals = game.getRivals();

  rivals.forEach((rival) => {
    const client = playersDB.getClient(rival as string);

    const response: Answer = {
      command: {
        type: client ? Signals.TURN : Signals.NOT_GET_IT,
        data,
        id: 0,
      },
      client,
    };

    responses.push(response);
  });

  return responses;
};
