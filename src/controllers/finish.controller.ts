import { gamesDB, playersDB, roomsDB } from '../dbs/index.js';
import { Game } from '../game.js';
import { Answer, Signals } from '../models/index.js';

export const finish = (game: Game, gameId: number | string): Answer[] => {
  const controllerSignal = Signals.FINISH;
  const responses: Answer[] = [];

  const outputs = game.getFinishData();

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

  if (game.checkGameOver()) {
    const rivals = game.getRivals();
    rivals.forEach((rival) => playersDB.setRoom(rival as string, undefined));
  }
  const gameForRoomId = game.getRoomId();
  if (gameForRoomId) {
    roomsDB.delete(gameForRoomId);
  }
  gamesDB.delete(gameId as number);
  return responses;
};
