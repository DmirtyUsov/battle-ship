import { playersDB } from '../dbs/index.js';
import { Answer } from '../models/index.js';
import {
  Command,
  LoginResult,
  Player,
  Signals,
  WebSocketExt,
} from '../models/index.js';

export const loginOrCreatePlayer = (
  command: Command<Player>,
  client: WebSocketExt,
): Answer => {
  const { name, password } = command.data;

  const loginResult: LoginResult = {
    name,
    index: name,
    error: true,
    errorText: 'Something wrong.',
  };

  const response = {
    command: {
      type: Signals.REG,
      data: loginResult,
      id: 0,
    },
    client,
  };

  if (command.type !== Signals.REG) {
    response.command.type = Signals.NOT_GET_IT;
    (response.command.data as unknown) = `Wrong type for loginOrCreatePlayer`;
    return response;
  }

  if (!name) {
    response.command.type = Signals.NOT_GET_IT;
    (response.command.data as unknown) = 'Empty name.';
    return response;
  }

  const player = playersDB.get(name);

  if (!player) {
    const newPlayer = playersDB.add({ name, password });
    if (newPlayer) {
      linkPlayerClient(name, client);
      loginResult.error = false;
      loginResult.errorText = '';
    }
    return response;
  }

  if (player.password !== password) {
    loginResult.errorText = 'Wrong Password.';
    return response;
  }

  if (player.client) {
    loginResult.errorText = 'Player already logged in.';
    return response;
  }

  linkPlayerClient(name, client);
  loginResult.error = false;
  loginResult.errorText = '';

  return response;
};

const linkPlayerClient = (name: string, client: WebSocketExt): void => {
  playersDB.setClient(name, client);
  client.playerName = name;
};
