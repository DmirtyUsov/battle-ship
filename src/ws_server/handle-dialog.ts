import { wsClientDB } from '../dbs/ws-client.db';
import { Command, CommandType, Message } from '../models';

export const handleDialog = (fromMessage: Message): void => {
  const toMessages: Message[] = [];
  const clientId = fromMessage.client.id;
  console.log(`#${clientId === undefined ? 'New' : clientId} Client --> Server`);
  console.log(fromMessage.command.data);

  toMessages.push(guardCommand(fromMessage));

  switch (fromMessage.command.type) {
    case CommandType.ON_CONNECTION: {
      const message = addClientCtrl(fromMessage);
      toMessages.push(message);
      break;
    }
    default:
      break;
  }

  sendMessages(toMessages);
};

const guardCommand = (fromMessage: Message): Message => {
  const command: Command = { type: CommandType.VOID, data: '', id: 0 };
  const toMessage: Message = { ...fromMessage, direction: 'to', command };
  const { type, data, id } = fromMessage.command;

  if (type === undefined || data === undefined || id !== 0) {
    toMessage.command.type = CommandType.NOT_GET_IT;
    toMessage.command.data = 'Wrong command format';
  }
  return toMessage;
};

const sendMessages = (toMessages: Message[]): void => {
  toMessages.forEach((message) => {
    const { client, command } = message;

    if (command.type === CommandType.VOID) {
      return;
    }

    console.log(`Server --> ${client.id} Client `);

    if (command.type === CommandType.NOT_GET_IT) {
      console.error('Server Error:', message.command.data);
      return;
    }

    try {
      const data = JSON.stringify(command.data);
      command.data = data;
      const message = JSON.stringify(command);

      console.log(message);

      client.send(message);
    } catch (error) {
      const message = (error as Error).message;
      console.error('Send Error', message);
    }
  });
};

const addClientCtrl = (fromMessage: Message): Message => {
  const command: Command = { type: CommandType.VOID, data: '', id: 0 };
  const toMessage: Message = { ...fromMessage, direction: 'to', command };
  toMessage.client = wsClientDB.add(fromMessage.client);
  return toMessage;
};
