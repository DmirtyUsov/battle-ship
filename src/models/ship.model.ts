import { Position, Size } from './index.js';

export type Ship = {
  position: Position;
  direction: boolean;
  length: number;
  type: Size;
};
