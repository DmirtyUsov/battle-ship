import { Ship } from './ship.model';

export type GameAddShipsDTO = {
  gameId: string | number;
  ships: Ship[];
  indexPlayer: number | string;
};
