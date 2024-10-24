import { RawData } from 'ws';
import { Command, Signals } from '../models/command.model.js';
import { Answer } from '../models/answer.model.js';
import { WebSocketWithId } from '../models/web-socket-with-id.model.js';

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

  switch (type) {
    case Signals.REG: {
      firstResponse.command.type = Signals.REG;
      firstResponse.command.data = 'Hello!';
      break;
    }
    default: {
      firstResponse.command.data = 'Unknown command';
      break;
    }
  }

  return responses;
};
