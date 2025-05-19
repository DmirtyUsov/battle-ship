import { playerDB } from '../dbs/player.db';
import { roomDB } from '../dbs/room.db';
import {
  Command,
  CommandType,
  LoginDTO,
  Message,
  RegistrationDTO,
  WebSocketClient,
} from '../models';
import { makeCommand } from './make-command';
import { updateRoomsToAllCtrl } from './room.ctrl';

export const addPlayerCtrl = (inMessage: Message): Message => {
  const loginDTO = inMessage.command.data as LoginDTO;

  const command: Command = makeCommand(CommandType.REG);
  const outMessage: Message = {
    ...inMessage,
    direction: 'out',
    command,
  };

  const { name, password } = loginDTO;
  const registrationDTO: RegistrationDTO = {
    name,
    index: 0,
    error: false,
    errorText: '',
  };

  if (!name) {
    registrationDTO.error = true;
    registrationDTO.errorText = 'Empty name.';
    outMessage.command.data = registrationDTO;

    return outMessage;
  }

  const player = playerDB.get(name);

  if (!player) {
    const newPlayer = playerDB.add(loginDTO);
    if (!newPlayer) {
      registrationDTO.error = true;
      registrationDTO.errorText = `Can't add player`;
    } else {
      linkPlayerClient(name, inMessage.client);
    }
    outMessage.command.data = registrationDTO;
    return outMessage;
  }

  if (player.password !== password) {
    registrationDTO.error = true;
    registrationDTO.errorText = 'Wrong Password.';
    outMessage.command.data = registrationDTO;
    return outMessage;
  }

  if (player.clientId !== undefined) {
    registrationDTO.error = true;
    registrationDTO.errorText = 'Player already logged in.';
    outMessage.command.data = registrationDTO;
    return outMessage;
  }

  linkPlayerClient(name, inMessage.client);
  outMessage.command.data = registrationDTO;
  return outMessage;
};

const linkPlayerClient = (name: string, client: WebSocketClient): void => {
  playerDB.setClientId(name, client.id);
  client.linkedPlayerName = name;
};

export const unlinkPlayerClientCtrl = (inMessage: Message): Message[] => {
  const command: Command = makeCommand();
  const outMessage: Message = {
    ...inMessage,
    direction: 'out',
    command,
  };
  const outMessages: Message[] = [];

  const name = inMessage.client.linkedPlayerName;

  if (name) {
    playerDB.setClientId(name, undefined);
    inMessage.client.linkedPlayerName = undefined;

    const player = playerDB.get(name);
    if (player) {
      if (player.roomId) {
        roomDB.delete(player.roomId);
        playerDB.setRoomId(name, undefined);
        const messages = updateRoomsToAllCtrl();
        outMessages.push(...messages);
      }
    }
  }
  outMessages.push(outMessage);
  return outMessages;
};
