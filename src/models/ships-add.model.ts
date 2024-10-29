import { Ship } from './index.js';

export type ShipsAdd = {
  gameId: number | string;
  ships: Ship[];
  indexPlayer: number | string;
};
