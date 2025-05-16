import { Message } from '../models';

export const handleDialog = (message: Message): void => {
  console.log(message.command.data);
};
