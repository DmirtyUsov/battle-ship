import { addClientCtrl, removeClientCtrl, validateCommandCtrl } from '../controllers';
import { CommandType, Message } from '../models';
import { sendMessages } from './send-messages';

export const handleDialog = (fromMessage: Message): void => {
  const toMessages: Message[] = [];

  const clientId = fromMessage.client.id;
  console.log(
    `#${clientId === undefined ? 'New' : clientId} Client --> Server`
  );
  console.log(fromMessage.command.data);

  toMessages.push(validateCommandCtrl(fromMessage));

  switch (fromMessage.command.type) {
    case CommandType.ON_CONNECTION: {
      const message = addClientCtrl(fromMessage);
      toMessages.push(message);
      break;
    }
    case CommandType.ON_CLOSE: {
      const message = removeClientCtrl(fromMessage);
      toMessages.push(message);
      break;
    }
    default:
      break;
  }

  sendMessages(toMessages);
};
