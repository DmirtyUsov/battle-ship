import { playerDB } from '../dbs/player.db';
import { roomDB } from '../dbs/room.db';
import { wsClientDB } from '../dbs/ws-client.db';
import {
  Command,
  CommandType,
  Message,
  RoomAddUserDTO,
  WebSocketClient,
} from '../models';
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

export const addUserToRoomCtrl = (inMessage: Message): Message => {
  const command: Command = makeCommand();
  const outMessage: Message = {
    ...inMessage,
    direction: 'out',
    command,
  };

  const playerName = inMessage.client.linkedPlayerName || '';
  if (playerDB.checkHasRoom(playerName)) {
    command.type = CommandType.NOT_GET_IT;
    command.data = `Player ${playerName} already in the room.`;
    return outMessage;
  }

  const { indexRoom } = inMessage.command.data as RoomAddUserDTO;
  const roomId = indexRoom as number;

  const room = roomDB.addPlayer(roomId, playerName);

  if (!room) {
    command.type = CommandType.NOT_GET_IT;
    command.data = `Room ${indexRoom} is already full or does not exist`;
    return outMessage;
  }

  playerDB.setRoomId(playerName, roomId);
  return outMessage;
};
