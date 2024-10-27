import { AttackStatus, Position } from './index.js';

export type AttackFeedback = {
  position: Position;
  currentPlayer: number | string;
  status: AttackStatus;
};
