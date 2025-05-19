import { AttackStatus } from './game-attack-status.model';
import { Position } from './position.mode';

export type AttackFeedbackDTO = {
  position: Position;
  currentPlayer: number | string;
  status: AttackStatus;
};
