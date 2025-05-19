import { playerDB } from '../dbs/player.db';
import { roomDB } from '../dbs/room.db';
import { BOT_ID, Game } from '../game';
import { Command, CommandType, GameCreateDTO, Message } from '../models';
import { makeCommand } from './make-command';

export const createSinglePLayGameCtrl = (inMessage: Message): Message => {
  const command: Command = makeCommand(CommandType.CREATE_GAME);
  const outMessage: Message = {
    ...inMessage,
    direction: 'out',
    command,
  };

  const name = inMessage.client.linkedPlayerName;

  if (!name) {
    command.type = CommandType.NOT_GET_IT;
    command.data = `Client #${inMessage.client.id} no linked to player`;
    return outMessage;
  }

  if (playerDB.checkHasRoom(name)) {
    command.type = CommandType.NOT_GET_IT;
    command.data = `Player already in room.`;
  }

  const newRoom = roomDB.create(name);
  if (!newRoom) {
    command.data = `Can't create new room.`;
    return outMessage;
  }

  playerDB.setRoomId(name, newRoom.id);
  roomDB.addPlayer(newRoom.id, BOT_ID);

  const game = new Game(newRoom);
  if (!game) {
    command.type = CommandType.NOT_GET_IT;
    command.data = `Can't create game`;
    return outMessage;
  }
  game.setBotShips();
  const data: GameCreateDTO = { idGame: game.id, idPlayer: name };
  command.data = data;

  return outMessage;
};
