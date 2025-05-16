import { Command, CommandType } from '../models';

const VOID_COMMAND: Command = { type: CommandType.VOID, data: '', id: 0 };

export const makeVoidCommand =(): Command =>{
  return {...VOID_COMMAND};
}
