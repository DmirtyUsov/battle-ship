import { playerDB } from '../dbs/player.db';
import { wsClientDB } from '../dbs/ws-client.db';
import {
  Command,
  CommandType,
  GameResponse,
  Message,
  WebSocketClient,
} from '../models';
import { makeCommand } from './make-command';

export const makeMessageFromResponse = (
  commandType: CommandType,
  gameResponse: GameResponse<unknown>
): Message => {
  const command: Command = makeCommand(commandType);
  const { data, toPlayerName } = gameResponse;
  if (data === undefined) {
    command.type = CommandType.NOT_GET_IT;
  }
  command.data = data;
  const outMessage: Message = {
    client: undefined as unknown as WebSocketClient,
    direction: 'out',
    command,
  };

  const player = playerDB.get(toPlayerName);

  if (!player || !player.clientId) {
    command.type = CommandType.NOT_GET_IT;
    command.data = `Make message for ${commandType}. Can't find player`;
    return outMessage;
  }

  const client = wsClientDB.get(player.clientId);
  if (!client) {
    command.type = CommandType.NOT_GET_IT;
    command.data = `Make message for ${commandType}. Can't find client`;
    return outMessage;
  }

  outMessage.client = client;
  command.data = data;

  return outMessage;
};
