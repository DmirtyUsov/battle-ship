import { gamesDB, playersDB, roomsDB, winnersDB } from '../dbs/index.js';
import { Answer, Signals } from '../models/index.js';

export const finish = (
  gameId: number | string,
  lostPlayerId: string = '',
  isForceToFinish: boolean = false,
): Answer[] => {
  const controllerSignal = Signals.FINISH;
  const responses: Answer[] = [];

  const game = gamesDB.get(gameId as number);

  if (!game) {
    return responses;
  }

  if (isForceToFinish) {
    game.forceFinish(lostPlayerId);
  }

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
    if (!isForceToFinish && !game.checkGameWithBot()) {
      winnersDB.addWin(game.getWinner());
    }
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
