import { CommandType, Message } from '../models';

export const sendMessages = (toMessages: Message[]): void => {
  toMessages.forEach((message) => {
    const { client, command } = message;

    if (command.type === CommandType.VOID) {
      return;
    }

    if (command.type === CommandType.NOT_GET_IT) {
      console.error('Server Error:', message.command.data);
      return;
    }
    
    console.log(`Server --> ${client.id} Client `);
    console.log(command);

    try {
      const data = JSON.stringify(command.data);
      command.data = data;
      const message = JSON.stringify(command);

      client.send(message);
    } catch (error) {
      const message = (error as Error).message;
      console.error('Send Error', message);
    }
  });
};
