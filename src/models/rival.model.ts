import { Board } from '../board';
import { Ship } from './ship.model';

export type Rival = {
  playerName: string;
  ships?: Ship[];
  board?: Board;
};
