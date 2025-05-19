import {
  addClientCtrl,
  addPlayerCtrl,
  addShipsCtrl,
  addUserToRoomCtrl,
  attackGameCtrl,
  createGameCtrl,
  createRoomCtrl,
  parseCommandCtrl,
  removeClientCtrl,
  startGameCtrl,
  turnGameCtrl,
  unlinkPlayerClientCtrl,
  updateRoomsCtrl,
  updateRoomsToAllCtrl,
} from '../controllers';
import { createSinglePLayGameCtrl } from '../controllers/bot.ctrl';
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
    case CommandType.ADD_USER_TO_ROOM: {
      const outMessageAdd = addUserToRoomCtrl(inMessage);
      outMessages.push(outMessageAdd);

      if (outMessageAdd.command.type !== CommandType.NOT_GET_IT) {
        const outMessagesUpdate = updateRoomsToAllCtrl();
        outMessages.push(...outMessagesUpdate);

        const outMessagesCreateGame = createGameCtrl(inMessage);
        outMessages.push(...outMessagesCreateGame);
      }
      break;
    }
    case CommandType.ADD_SHIPS: {
      const outMessageAddShips = addShipsCtrl(inMessage);
      outMessages.push(outMessageAddShips);

      if (outMessageAddShips.command.type !== CommandType.NOT_GET_IT) {
        const outMessagesStartGame = startGameCtrl(inMessage);
        outMessages.push(...outMessagesStartGame);
      }

      const { length, [length - 1]: lastOutMessage } = outMessages;

      if (lastOutMessage.command.type === CommandType.START_GAME) {
        const outMessagesTurnGame = turnGameCtrl(inMessage);
        outMessages.push(...outMessagesTurnGame);
      }
      break;
    }
    case CommandType.RANDOM_ATTACK:
    case CommandType.ATTACK: {
      const outMessageAttack = attackGameCtrl(inMessage);
      outMessages.push(...outMessageAttack);

      const { length, [length - 1]: lastOutMessage } = outMessages;

      if (lastOutMessage.command.type === CommandType.ATTACK) {
        const outMessagesTurnGame = turnGameCtrl(inMessage);
        outMessages.push(...outMessagesTurnGame);
      }

      break;
    }
    case CommandType.SINGLE_PLAY: {
      const outMessageCreate = createSinglePLayGameCtrl(inMessage);
      outMessages.push(outMessageCreate);
      break;
    }
    default:
      break;
  }

  sendMessages(outMessages);
};
