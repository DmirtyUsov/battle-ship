import { playersDB } from '../dbs/index.js';
import { Answer, WebSocketExt } from '../models/index.js';

export const unlinkPlayer = (client: WebSocketExt): Answer | null => {
  const { playerName } = client;
  if (playerName) {
    playersDB.setClient(playerName, undefined);
    client.playerName = undefined;
  }
  return null;
};
