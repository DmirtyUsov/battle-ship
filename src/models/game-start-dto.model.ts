import { Ship } from './ship.model';

export type GameStartDTO = {
  ships: Ship[];
  currentPlayerIndex: number | string;
};
