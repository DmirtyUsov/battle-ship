import {
  addClientCtrl,
  addPlayerCtrl,
  createRoomCtrl,
  parseCommandCtrl,
  removeClientCtrl,
  unlinkPlayerClientCtrl,
  updateRoomsCtrl,
  updateRoomsToAllCtrl,
} from '../controllers';
import { CommandType, Message } from '../models';
import { sendMessages } from './send-messages';

export const handleDialog = (inMessage: Message): void => {
  const outMessages: Message[] = [];

  const clientId = inMessage.client.id;
  console.log(
    `#${clientId === undefined ? 'New' : clientId} Client --> Server`
  );

  outMessages.push(...parseCommandCtrl(inMessage));
  console.log(inMessage.command);

  switch (inMessage.command.type) {
    case CommandType.ON_CONNECTION: {
      const message = addClientCtrl(inMessage);
      outMessages.push(message);
      break;
    }
    case CommandType.ON_CLOSE: {
      const message = removeClientCtrl(inMessage);
      outMessages.push(message);
      if (inMessage.client.linkedPlayerName !== undefined) {
        const messages = unlinkPlayerClientCtrl(inMessage);
        outMessages.push(...messages);
      }
      break;
    }
    case CommandType.REG: {
      const outMessageReg = addPlayerCtrl(inMessage);
      outMessages.push(outMessageReg);

      if (outMessageReg.command.type !== CommandType.NOT_GET_IT) {
        const outMessageUpdateRoom = updateRoomsCtrl(inMessage);
        outMessages.push(outMessageUpdateRoom);
      }
      break;
    }
    case CommandType.CREATE_ROOM: {
      const outMessageCreate = createRoomCtrl(inMessage);
      outMessages.push(outMessageCreate);

      if (outMessageCreate.command.type !== CommandType.NOT_GET_IT) {
        const outMessagesUpdate = updateRoomsToAllCtrl();
        outMessages.push(...outMessagesUpdate);
      }

      break;
    }
    default:
      break;
  }

  sendMessages(outMessages);
};
