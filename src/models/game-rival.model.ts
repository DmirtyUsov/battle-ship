import { Board } from '../board.js';
import { Ship } from './index.js';

export type GameRival = {
  playerName: string;
  ships?: Ship[];
  board?: Board;
};
