import { playersDB, roomsDB } from '../dbs/index.js';
import {
  Answer,
  Command,
  Signals,
  WebSocketExt,
} from '../models/index.js';
import { updateRoomState } from './index.js';

export const createRoom = (
  command: Command<string>,
  client: WebSocketExt,
): Answer => {
  const { type } = command;

  let response: Answer = {
    command: {
      type: Signals.NOT_GET_IT,
      data: `from ${Signals.CREATE_ROOM} controller`,
      id: 0,
    },
    client,
  };

  if (type !== Signals.CREATE_ROOM) {
    response.command.data = `Wrong controller for ${command.type}`;
    return response;
  }

  const playerName = client.playerName || '';

  if (!client.playerName) {
    response.command.data = `Client #${client.id} not linked to player`;
    return response;
  }

  if (!playersDB.checkExists(playerName)) {
    response.command.data = `Player  ${playerName} does not exist`;
    return response;
  }

  if (playersDB.checkHasRoom(playerName)) {
    response.command.data = `Player ${playerName} already in the room`;
    return response;
  }

  const newRoom = roomsDB.add(playerName);
  if (newRoom) {
    playersDB.setRoom(playerName, newRoom.id);
    response = updateRoomState(client);
  }

  return response;
};
