import { RawData } from 'ws';
import {
  Answer,
  Command,
  Player,
  Signals,
  WebSocketExt,
} from '../models/index.js';
import {
  createRoom,
  loginOrCreatePlayer,
  updateRoomState,
} from '../controllers/index.js';

export const handleDialog = (
  client: WebSocketExt,
  rawData: RawData,
): Answer[] => {
  let request: Command<unknown> | undefined;
  const responses: Answer[] = [];

  const responseBad: Answer = {
    command: { type: Signals.NOT_GET_IT, data: '', id: 0 },
    client,
  };
  responses.push(responseBad);

  try {
    request = JSON.parse(rawData.toString());
    console.log(request);
  } catch (error) {
    const message = (error as Error).message;
    responseBad.command.data = message;
  }

  if (!request) {
    return responses;
  }

  const { type, data, id } = request;
  if (type === undefined || data === undefined || id !== 0) {
    responseBad.command.data = 'Wrong command format';
    return responses;
  }

  if (data) {
    try {
      const payload = JSON.parse(data as string);
      request.data = payload;
    } catch (error) {
      const message = (error as Error).message;
      responseBad.command.data = message;
      return responses;
    }
  }

  switch (type) {
    case Signals.REG: {
      responses.pop();
      const response1 = loginOrCreatePlayer(request as Command<Player>, client);
      responses.push(response1);
      const response2 = updateRoomState(client);
      responses.push(response2);
      break;
    }
    case Signals.CREATE_ROOM: {
      responses.pop();
      const response = createRoom(request as Command<string>, client);
      responses.push(response);
      break;
    }
    default: {
      responseBad.command.data = 'Unknown command';
      break;
    }
  }

  return responses;
};
