import { Board } from './board.js';
import { GRID_SIZE } from './config.js';
import {
  AttackFeedback,
  GameRival,
  GameStart,
  GameTurn,
  Position,
  Room,
  Ship,
} from './models/index.js';

type RivalIndex = string | number;
type GameRivals = { [id: RivalIndex]: GameRival };
type State = 'setup' | 'on' | 'over';

export class Game {
  private rivals: GameRivals = {};
  private state: State = 'setup';
  private isFirstRivalInAttack = false;

  constructor(room: Room) {
    const [rival1, rival2] = room.players;
    this.rivals[rival1] = { playerName: rival1 };
    this.rivals[rival2] = { playerName: rival2 };
  }

  getRivals(): RivalIndex[] {
    return Object.keys(this.rivals);
  }

  getRival(attackerId: RivalIndex): RivalIndex {
    const rivals = this.getRivals();
    return rivals.filter((rival) => rival !== attackerId)[0];
  }

  checkRival(name: RivalIndex): boolean {
    return this.getRivals().includes(name);
  }

  setRivalShips(name: RivalIndex, ships: Ship[]): boolean {
    const result = this.checkRival(name);
    if (result) {
      this.rivals[name].ships = ships;
      this.rivals[name].board = new Board(ships, GRID_SIZE);
    }
    return result;
  }

  checkFleetReadiness(): boolean {
    return Object.values(this.rivals).every(
      (rival) => rival.ships !== undefined,
    );
  }

  getGameStartData(): GameStart[] {
    return Object.values(this.rivals).map(({ ships = [], playerName }) => {
      const data: GameStart = {
        ships,
        currentPlayerIndex: playerName,
      };
      return data;
    });
  }

  checkGameOn(): boolean {
    return this.state === 'on';
  }

  checkTurn(attackerId: RivalIndex): boolean {
    if (!this.checkGameOn()) {
      return false;
    }
    const currentTurnRival = this.getCurrentTurnRival();
    return attackerId === currentTurnRival;
  }

  private getCurrentTurnRival(): RivalIndex {
    const idxRivalTurn = this.isFirstRivalInAttack ? 0 : 1;
    const rivals = this.getRivals();
    return rivals[idxRivalTurn];
  }

  turn(): GameTurn {
    if (this.state === 'setup') {
      this.state = 'on';
    }

    this.isFirstRivalInAttack = !this.isFirstRivalInAttack;

    return {
      currentPlayer: this.getCurrentTurnRival(),
    };
  }

  attack(
    attackerId: RivalIndex,
    position: Position,
  ): AttackFeedback[] | undefined {
    const victimId = this.getRival(attackerId);

    const victimBoard = this.rivals[victimId].board;

    if (!victimBoard) {
      return undefined;
    }

    const boardFeedbacks = victimBoard.attack(position);

    const feedbacks: AttackFeedback[] = [];

    boardFeedbacks.forEach((entry) => {
      const feedback: AttackFeedback = {
        ...entry,
        currentPlayer: attackerId,
      };
      feedbacks.push(feedback);
    });

    return feedbacks;
  }

  getRandomPosition(): Position {
    return Board.getRandomPosition(GRID_SIZE);
  }
}
