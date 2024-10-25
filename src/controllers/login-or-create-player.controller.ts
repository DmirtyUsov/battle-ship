import { playersDB } from '../dbs/index.js';
import { Answer } from '../models/index.js';
import {
  Command,
  LoginResult,
  Player,
  Signals,
  WebSocketExt,
} from '../models/index.js';
import { makeBaseAnswerCheckCmdValidity } from './controller-guard.js';

export const loginOrCreatePlayer = (
  command: Command<Player>,
  client: WebSocketExt,
): Answer => {
  const controllerSignal = Signals.REG;

  const { baseResponse, isCommandValid } = makeBaseAnswerCheckCmdValidity(
    command,
    client,
    controllerSignal,
  );

  if (!isCommandValid) {
    return baseResponse;
  }

  const { name, password } = command.data;

  const loginResult: LoginResult = {
    name,
    index: name,
    error: true,
    errorText: 'Something wrong.',
  };

  baseResponse.command.data = loginResult;
  baseResponse.command.type = Signals.REG;

  if (!name) {
    (baseResponse.command.data as unknown) = 'Empty name.';
    return baseResponse;
  }

  const player = playersDB.get(name);

  if (!player) {
    const newPlayer = playersDB.add({ name, password });
    if (newPlayer) {
      linkPlayerClient(name, client);
      loginResult.error = false;
      loginResult.errorText = '';
    }
    return baseResponse;
  }

  if (player.password !== password) {
    loginResult.errorText = 'Wrong Password.';
    return baseResponse;
  }

  if (player.clientId) {
    loginResult.errorText = 'Player already logged in.';
    return baseResponse;
  }

  linkPlayerClient(name, client);
  loginResult.error = false;
  loginResult.errorText = '';

  return baseResponse;
};

const linkPlayerClient = (name: string, client: WebSocketExt): void => {
  playersDB.setClient(name, client);
  client.playerName = name;
};
