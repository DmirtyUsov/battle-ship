import { winnersDB } from '../dbs/index.js';
import { Answer, Signals, WebSocketExt } from '../models/index.js';

export const updateWinners = (client: WebSocketExt): Answer => {
  const data = winnersDB.getAll();

  const response: Answer = {
    command: {
      type: Signals.UPDATE_WINNERS,
      data,
      id: 0,
    },
    client,
  };

  return response;
};
