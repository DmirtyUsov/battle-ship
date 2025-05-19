import { CommandType } from './command-type.model';

export type Command = {
  type: CommandType;
  data: unknown;
  id: number;
};
