import { wsClientDB } from '../dbs/ws-client.db';
import { Command, CommandType, Message } from '../models';
import { makeCommand } from './make-command';
import { unlinkPlayerClientCtrl } from './player.ctrl';

export const addClientCtrl = (inMessage: Message): Message => {
  const command: Command = makeCommand();
  const toMessage: Message = { ...inMessage, direction: 'out', command };
  toMessage.client = wsClientDB.add(inMessage.client);
  return toMessage;
};

export const removeClientCtrl = (inMessage: Message): Message => {
  const command: Command = makeCommand();
  const toMessage: Message = { ...inMessage, direction: 'out', command };
  const deleteClient = wsClientDB.delete(inMessage.client.id);
  if (!deleteClient) {
    command.type = CommandType.NOT_GET_IT;
    command.data = `Delete. Not found client #${inMessage.client.id} in DB`;
  }
  if (inMessage.client.linkedPlayerName) {
    unlinkPlayerClientCtrl(inMessage.client.linkedPlayerName, inMessage.client);
  }
  return toMessage;
};
