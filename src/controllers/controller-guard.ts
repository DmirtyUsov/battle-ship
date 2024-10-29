import { playersDB } from '../dbs/index.js';
import { Answer, Command, Signals, WebSocketExt } from '../models/index.js';

type GuardOutput = { baseResponse: Answer; isCommandValid: boolean };

const makeBaseAnswer = (
  client: WebSocketExt,
  controllerSignal: Signals,
): Answer => {
  return {
    command: {
      type: Signals.NOT_GET_IT,
      data: `from ${controllerSignal} controller`,
      id: 0,
    },
    client,
  };
};

export const makeBaseAnswerCheckCmdValidity = (
  command: Command<unknown>,
  client: WebSocketExt,
  controllerSignal: Signals,
): GuardOutput => {
  let isCommandValid = true;

  const baseResponse = makeBaseAnswer(client, controllerSignal);

  if (command.type !== controllerSignal) {
    baseResponse.command.data = `${controllerSignal} controller used for ${command.type}`;
    isCommandValid = false;
  }
  return { baseResponse, isCommandValid };
};

export const makeBaseAnswerCheckCmdPlayerValidity = (
  command: Command<unknown>,
  client: WebSocketExt,
  controllerSignal: Signals,
): GuardOutput => {
  const { baseResponse, isCommandValid } = makeBaseAnswerCheckCmdValidity(
    command,
    client,
    controllerSignal,
  );

  let isCommandPlayerValid = isCommandValid;

  const playerName = client.playerName || '';

  if (isCommandPlayerValid && client.playerName === undefined) {
    baseResponse.command.data = `Client #${client.id} not linked to player`;
    isCommandPlayerValid = false;
  }

  if (isCommandPlayerValid && !playersDB.checkExists(playerName)) {
    baseResponse.command.data = `Player ${playerName} does not exist`;
    isCommandPlayerValid = false;
  }

  return { baseResponse, isCommandValid: isCommandPlayerValid };
};
