import { playerDB } from '../dbs/player.db';
import { roomDB } from '../dbs/room.db';
import { wsClientDB } from '../dbs/ws-client.db';
import { Game } from '../game';
import {
  Command,
  CommandType,
  GameCreateDTO,
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
