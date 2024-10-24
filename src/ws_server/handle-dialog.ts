import { RawData } from 'ws';
import {
  Answer,
  Command,
  Player,
  Signals,
  WebSocketWithId,
} from '../models/index.js';
import { loginOrCreatePlayer } from '../controllers/index.js';

export const handleDialog = (
  client: WebSocketWithId,
  rawData: RawData,
): Answer[] => {
  let request: Command<unknown> | undefined;
  const responses: Answer[] = [];

  const firstResponse: Answer = {
    command: { type: Signals.NOT_GET_IT, data: '', id: 0 },
    client,
  };
  responses.push(firstResponse);

  try {
    request = JSON.parse(rawData.toString());
    console.log(request);
  } catch (error) {
    const message = (error as Error).message;
    firstResponse.command.data = message;
  }

  if (!request) {
    return responses;
  }

  const { type, data, id } = request;
  if (type === undefined || data === undefined || id !== 0) {
    firstResponse.command.data = 'Wrong command format';
    return responses;
  }

  if (data) {
    try {
      const payload = JSON.parse(data as string);
      request.data = payload;
    } catch (error) {
      const message = (error as Error).message;
      firstResponse.command.data = message;
      return responses;
    }
  }

  switch (type) {
    case Signals.REG: {
      const result = loginOrCreatePlayer(request as Command<Player>, client);
      responses.pop();
      responses.push(result);
      break;
    }
    default: {
      firstResponse.command.data = 'Unknown command';
      break;
    }
  }

  return responses;
};
