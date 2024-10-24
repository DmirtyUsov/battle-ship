import { roomsDB } from '../dbs/index.js';
import { Answer, Command, Signals, WebSocketExt } from '../models/index.js';
import { updateRoomState } from './index.js';

export const createRoom = (
  command: Command<string>,
  client: WebSocketExt,
): Answer => {
  const { type } = command;

  let response: Answer = {
    command: {
      type: Signals.NOT_GET_IT,
      data: `Wrong type for createRoom`,
      id: 0,
    },
    client,
  };

  if (type !== Signals.CREATE_ROOM) {
    return response;
  }

  if (client.playerName) {
    roomsDB.add(client.playerName);
    response = updateRoomState(client);
  } else {
    response.command.data = `Client #${client.id} not linked to player`;
  }
  return response;
};
