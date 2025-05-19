import { CommandType, Message } from '../models';
import { makeCommand } from './make-command';

export const parseCommandCtrl = (fromMessage: Message): Message[] => {
  const command1 = makeCommand();
  const toMessage1: Message = {
    ...fromMessage,
    direction: 'out',
    command: command1,
  };

  const { type, data, id } = fromMessage.command;

  if (type === undefined || data === undefined || id !== 0) {
    toMessage1.command.type = CommandType.NOT_GET_IT;
    toMessage1.command.data = 'Wrong command format';
  }
  const isParseData =
    toMessage1.command.type !== CommandType.NOT_GET_IT &&
    type &&
    type !== CommandType.ON_CONNECTION &&
    type !== CommandType.ON_CLOSE &&
    type !== CommandType.NOT_GET_IT;

  const command2 = makeCommand();
  const toMessage2: Message = {
    ...fromMessage,
    direction: 'out',
    command: command2,
  };
  if (data && typeof data === 'string' && isParseData) {
    try {
      const payload = JSON.parse(data as string);
      fromMessage.command.data = payload;
    } catch (error) {
      console.log('parseCommandCtrl error for', data);
      const message = (error as Error).message;
      toMessage2.command.type = CommandType.NOT_GET_IT;
      toMessage2.command.data = `parseCommandCtrl: ${message}`;
    }
  }
  return [toMessage1, toMessage2];
};
