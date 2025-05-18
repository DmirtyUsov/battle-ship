import { playerDB } from '../dbs/player.db';
import { roomDB } from '../dbs/room.db';
import { wsClientDB } from '../dbs/ws-client.db';
import { Game } from '../game';
import {
  Command,
  CommandType,
  GameAddShipsDTO,
  GameCreateDTO,
  GameStartDTO,
  Message,
  RoomAddUserDTO,
} from '../models';
import { makeCommand } from './make-command';

export const createGameCtrl = (inMessage: Message): Message[] => {
  const command: Command = makeCommand(CommandType.CREATE_GAME);
  const outMessage: Message = {
    ...inMessage,
    direction: 'out',
    command: command,
  };

  const { indexRoom } = inMessage.command.data as RoomAddUserDTO;
  const roomId = indexRoom as number;

  const room = roomDB.get(roomId);

  if (!room) {
    command.type = CommandType.NOT_GET_IT;
    command.data = `Can't find room`;
    return [outMessage];
  }

  const game = new Game(room);
  if (!game) {
    command.type = CommandType.NOT_GET_IT;
    command.data = `Can't create game`;
    return [outMessage];
  }

  const outMessages: Message[] = game.playersName.map((name) => {
    const player = playerDB.setGameId(name, game.id);
    const command: Command = makeCommand(CommandType.CREATE_GAME);
    const outMessage: Message = {
      ...inMessage,
      direction: 'out',
      command: command,
    };
    if (!player || !player.clientId) {
      command.type = CommandType.NOT_GET_IT;
      command.data = `Can't find player ${name}`;
      return outMessage;
    }

    const client = wsClientDB.get(player.clientId);

    if (!client) {
      command.type = CommandType.NOT_GET_IT;
      command.data = `Client undefined`;
      return outMessage;
    }

    const data: GameCreateDTO = { idGame: game.id, idPlayer: name };
    command.data = data;
    outMessage.client = client;
    return outMessage;
  });

  return outMessages;
};

export const addShipsCtrl = (inMessage: Message): Message => {
  const command: Command = makeCommand();
  const outMessage: Message = {
    ...inMessage,
    direction: 'out',
    command: command,
  };

  const data = inMessage.command.data as GameAddShipsDTO;
  const gameId = data.gameId as number;
  const name = data.indexPlayer as string;

  const game = Game.getGame(gameId);

  if (!game) {
    command.type = CommandType.NOT_GET_IT;
    command.data = `Game with id ${gameId} does not exist`;
    return outMessage;
  }

  if (!game.setPlayerShips(name, data.ships)) {
    command.type = CommandType.NOT_GET_IT;
    command.data = `Game id ${gameId} does not have an indexPlayer ${name}`;
    return outMessage;
  }

  return outMessage;
};

export const startGameCtrl = (inMessage: Message): Message[] => {
  const command: Command = makeCommand();
  const outMessage: Message = {
    ...inMessage,
    direction: 'out',
    command: command,
  };

  const data = inMessage.command.data as GameAddShipsDTO;
  const gameId = data.gameId as number;

  const game = Game.getGame(gameId);

  if (!game) {
    command.type = CommandType.NOT_GET_IT;
    command.data = `Start Game. Game with id ${gameId} does not exist`;
    return [outMessage];
  }

  if (!game.checkShipsReadiness()) {
    return [outMessage];
  }
  const outMessages: Message[] = game
    .getGameStartData()
    .map((data: GameStartDTO) => {
      const command: Command = makeCommand(CommandType.START_GAME);
      const outMessage: Message = {
        ...inMessage,
        direction: 'out',
        command,
      };
      const name = data.currentPlayerIndex as string;

      const player = playerDB.get(name);

      if (!player || !player.clientId) {
        command.type = CommandType.NOT_GET_IT;
        command.data = `Start Game. Can't find player`;
        return outMessage;
      }

      const client = wsClientDB.get(player.clientId);
      if (!client) {
        command.type = CommandType.NOT_GET_IT;
        command.data = `Start Game. Can't find client`;
        return outMessage;
      }

      outMessage.client = client;
      command.data = data;

      return outMessage;
    });

  return outMessages;
};
