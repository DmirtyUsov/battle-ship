import { wsClientDB } from '../dbs/ws-client.db';
import { Command, CommandType, Message } from '../models';
import { makeVoidCommand } from './make-void-command';

export const addClientCtrl = (fromMessage: Message): Message => {
  const command: Command = makeVoidCommand();
  const toMessage: Message = { ...fromMessage, direction: 'to', command };
  toMessage.client = wsClientDB.add(fromMessage.client);
  return toMessage;
};

export const removeClientCtrl = (fromMessage: Message): Message => {
  const command: Command = makeVoidCommand();
  const toMessage: Message = { ...fromMessage, direction: 'to', command };
  const deleteClient = wsClientDB.delete(fromMessage.client.id);
  if (!deleteClient) {
    command.type = CommandType.NOT_GET_IT;
    command.data = `Delete. Not found client #${fromMessage.client.id} in DB`;
  }
  return toMessage;
};
