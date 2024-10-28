import { playersDB } from '../dbs/index.js';
import { Game } from '../game.js';
import { Answer, Signals } from '../models/index.js';

export const turn = (game: Game): Answer[] => {
  const controllerSignal = Signals.TURN;
  const responses: Answer[] = [];

  const outputs = game.turn();

  outputs.forEach((item) => {
    const client = playersDB.getClient(item.toRivalId as string);

    const response: Answer = {
      command: {
        type: client ? controllerSignal : Signals.NOT_GET_IT,
        data: item.output,
        id: 0,
      },
      client,
    };

    responses.push(response);
  });

  return responses;
};
