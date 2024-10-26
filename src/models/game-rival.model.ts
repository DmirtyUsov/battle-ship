import { Ship } from './index.js';

export type GameRival = {
  playerName: string;
  ships?: Ship[];
};
