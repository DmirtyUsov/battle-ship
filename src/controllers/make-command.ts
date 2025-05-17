import { Command, CommandType } from '../models';

const VOID_COMMAND: Command = { type: CommandType.VOID, data: 'from makeCommand', id: 0 };

export const makeCommand = (type: CommandType = CommandType.VOID): Command => {
  return { ...VOID_COMMAND, type };
};
