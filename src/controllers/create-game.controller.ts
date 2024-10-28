import { gamesDB, playersDB } from '../dbs/index.js';
import { Answer, GameCreate, Room, Signals } from '../models/index.js';

export const createGame = (room: Room): Answer[] => {
  const gameId = gamesDB.createGameForRoom(room);
  const game = gamesDB.get(gameId);
  const rivals = game.getRivals();

  rivals.forEach((rival) => playersDB.setGame(rival as string, gameId));

  const rival1Response = makeResponseForRival(gameId, rivals[0] as string);
  const rival2Response = makeResponseForRival(gameId, rivals[1] as string);

  return [rival1Response, rival2Response];
};

const makeResponseForRival = (gameId: number, name: string): Answer => {
  const gameCreate: GameCreate = {
    idGame: gameId,
    idPlayer: name,
  };

  const client = playersDB.getClient(name);

  const response: Answer = {
    command: {
      type: client ? Signals.CREATE_GAME : Signals.NOT_GET_IT,
      data: gameCreate,
      id: 0,
    },
    client,
  };

  return response;
};
