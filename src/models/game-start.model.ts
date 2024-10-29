import { Ship } from './index.js';

export type GameStart = {
  ships: Ship[];
  currentPlayerIndex: number | string;
};
