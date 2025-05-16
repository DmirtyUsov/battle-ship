import { wsClientDB } from '../dbs/ws-client.db';
import { Command, Message } from '../models';
import { makeVoidCommand } from './make-void-command';

export const addClientCtrl = (fromMessage: Message): Message => {
  const command: Command = makeVoidCommand();
  const toMessage: Message = { ...fromMessage, direction: 'to', command };
  toMessage.client = wsClientDB.add(fromMessage.client);
  return toMessage;
};
