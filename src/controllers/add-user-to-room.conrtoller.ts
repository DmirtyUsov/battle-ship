import {
  Answer,
  Command,
  RoomIndex,
  Signals,
  WebSocketExt,
} from '../models/index.js';
import { makeBaseAnswerCheckCmdPlayerValidity } from './controller-guard.js';

export const addUserToRoom = (
  command: Command<RoomIndex>,
  client: WebSocketExt,
): Answer => {
  const controllerSignal = Signals.ADD_USER_TO_ROOM;

  const { baseResponse, isCommandValid } = makeBaseAnswerCheckCmdPlayerValidity(
    command,
    client,
    controllerSignal,
  );

  if (!isCommandValid) {
    return baseResponse;
  }

  let response = baseResponse;
};
