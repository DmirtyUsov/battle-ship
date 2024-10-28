import { Board } from './board.js';
import { BOT_ID, GRID_SIZE } from './config.js';
import {
  AttackFeedback,
  GameFinish,
  GameOutput,
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
  private isFirstRivalInAttack = true;
  private winnerId: RivalIndex | undefined;
  private gameForRoomId: number | undefined;

  constructor(room: Room) {
    const [rival1, rival2] = room.players;
    this.gameForRoomId = room.id;
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

  getRoomId(): number | undefined {
    return this.gameForRoomId;
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

  setBotShips(name: RivalIndex): boolean {
    return this.setRivalShips(name, BOT_SHIPS);
  }

  checkFleetReadiness(): boolean {
    return Object.values(this.rivals).every(
      (rival) => rival.ships !== undefined,
    );
  }

  getGameStartData(): GameStart[] {
    return Object.values(this.rivals)
      .filter((entry) => entry.playerName !== BOT_ID)
      .map(({ ships = [], playerName }) => {
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

  checkGameOver(): boolean {
    return this.state === 'over';
  }

  checkTurn(attackerId: RivalIndex): boolean {
    if (!this.checkGameOn()) {
      return false;
    }
    const currentTurnRival = this.getCurrentTurnRival();
    return attackerId === currentTurnRival;
  }

  checkGameWithBot(): boolean {
    return this.getRivals().includes(BOT_ID);
  }

  private getCurrentTurnRival(): RivalIndex {
    const idxRivalTurn = this.isFirstRivalInAttack ? 0 : 1;
    const rivals = this.getRivals();
    return rivals[idxRivalTurn];
  }

  turn(): GameOutput<GameTurn>[] {
    if (this.state === 'setup') {
      this.state = 'on';
    }

    const rivals = this.getRivals().filter((rival) => rival !== BOT_ID);

    if (this.checkGameOn() && rivals.length > 1) {
      this.isFirstRivalInAttack = !this.isFirstRivalInAttack;
    }

    const outputs: GameOutput<GameTurn>[] = rivals.map((rival) => {
      return {
        output: {
          currentPlayer: this.getCurrentTurnRival(),
        },
        toRivalId: rival,
      };
    });

    return outputs;
  }

  attack(
    attackerId: RivalIndex,
    position: Position,
  ): GameOutput<AttackFeedback>[] | undefined {
    const victimId = this.getRival(attackerId);

    const victimBoard = this.rivals[victimId].board;

    if (!this.checkGameOn() || !victimBoard) {
      return undefined;
    }

    const boardFeedbacks = victimBoard.attack(position);
    if (victimBoard.checkNoShipsOnBoard()) {
      this.end(attackerId);
    }

    const feedbacks: GameOutput<AttackFeedback>[] = [];

    boardFeedbacks.forEach((entry) => {
      const feedback: AttackFeedback = {
        ...entry,
        currentPlayer: attackerId,
      };

      if (attackerId !== BOT_ID) {
        const feedbackToAttacker: GameOutput<AttackFeedback> = {
          output: { ...feedback },
          toRivalId: attackerId,
        };
        feedbacks.push(feedbackToAttacker);
      }

      if (victimId !== BOT_ID) {
        const feedbackToVictim: GameOutput<AttackFeedback> = {
          output: { ...feedback },
          toRivalId: victimId,
        };
        feedbacks.push(feedbackToVictim);
      }
    });

    return feedbacks;
  }

  attackByBot(): GameOutput<AttackFeedback>[] | undefined {
    const position = this.getRandomPositionForAttack(BOT_ID);
    return this.attack(BOT_ID, position);
  }

  private end(winnerId: RivalIndex): void {
    this.state = 'over';
    this.winnerId = winnerId;
  }

  getWinner(): string {
    return this.winnerId as string;
  }

  getFinishData(): GameOutput<GameFinish>[] {
    const rivals = this.checkGameOver() ? this.getRivals() : [];

    const outputs: GameOutput<GameFinish>[] = rivals.map((rival) => {
      return {
        output: {
          winPlayer: this.getWinner(),
        },
        toRivalId: rival,
      };
    });

    return outputs;
  }
  private getBoard(rival: RivalIndex): Board | undefined {
    return this.rivals[rival].board;
  }
  getRandomPositionForAttack(attackerId: RivalIndex): Position {
    const board = this.getBoard(attackerId);
    const position = board ? board.getRandomPosition() : { x: 0, y: 0 };
    return position;
  }

  forceFinish(winnerId: RivalIndex): void {
    this.end(winnerId);
  }
}

const BOT_SHIPS: Ship[] = [
  { position: { x: 4, y: 5 }, direction: false, type: 'huge', length: 4 },
  { position: { x: 6, y: 7 }, direction: false, type: 'large', length: 3 },
  { position: { x: 1, y: 0 }, direction: true, type: 'large', length: 3 },
  { position: { x: 9, y: 3 }, direction: true, type: 'medium', length: 2 },
  { position: { x: 0, y: 5 }, direction: false, type: 'medium', length: 2 },
  { position: { x: 2, y: 7 }, direction: true, type: 'medium', length: 2 },
  { position: { x: 8, y: 0 }, direction: true, type: 'small', length: 1 },
  { position: { x: 0, y: 8 }, direction: false, type: 'small', length: 1 },
  { position: { x: 5, y: 1 }, direction: false, type: 'small', length: 1 },
  { position: { x: 8, y: 9 }, direction: true, type: 'small', length: 1 },
];
