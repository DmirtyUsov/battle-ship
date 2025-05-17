import { playerDB } from '../dbs/player.db';
import { roomDB } from '../dbs/room.db';
import { wsClientDB } from '../dbs/ws-client.db';
import { Command, CommandType, Message, WebSocketClient } from '../models';
import { makeCommand } from './make-command';

export const createRoomCtrl = (inMessage: Message): Message => {
  const command: Command = makeCommand();
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
  if (newRoom) {
    playerDB.setRoomId(name, newRoom.id);
    return outMessage;
  }

  command.type = CommandType.NOT_GET_IT;
  command.data = `Can't create new room.`;
  return outMessage;
};

export const updateRoomsCtrl = (inMessage: Message): Message => {
  return updateRoom([inMessage.client])[0];
};

export const updateRoomsToAllCtrl = (): Message[] => {
  const clients = wsClientDB.list();
  return updateRoom(clients);
};

const updateRoom = (clients: WebSocketClient[]): Message[] => {
  const data = roomDB.getRoomsOnePlayer();

  const outMessages = clients.map((client) => {
    const command: Command = makeCommand(CommandType.UPDATE_ROOM);
    command.data = data;
    const outMessage: Message = {
      client,
      direction: 'out',
      command,
    };
    return outMessage;
  });

  return outMessages;
};
