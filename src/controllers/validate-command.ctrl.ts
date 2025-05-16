import { CommandType, Message } from '../models';
import { makeVoidCommand } from './make-void-command';

export const validateCommandCtrl = (fromMessage: Message): Message => {
  const command = makeVoidCommand();
  const toMessage: Message = { ...fromMessage, direction: 'to', command };

  const { type, data, id } = fromMessage.command;

  if (type === undefined || data === undefined || id !== 0) {
    toMessage.command.type = CommandType.NOT_GET_IT;
    toMessage.command.data = 'Wrong command format';
  }
  return toMessage;
};
