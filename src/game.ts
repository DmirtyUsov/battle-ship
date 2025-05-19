import { Board } from './board';
import {
  AttackFeedbackDTO,
  GameAttackDTO,
  GameFinishDTO,
  GameResponse,
  GameStartDTO,
  GameTurnDTO,
  Position,
  Rival,
  Room,
  Ship,
} from './models';

export const BOT_ID = 'bot45SdWWe8';

type GameState = 'setup' | 'on' | 'over';
type PlayerIndex = string;

export class Game {
  private rivals: Record<PlayerIndex, Rival> = {};
  private readonly roomId: number;
  private readonly gameId: number;
  private state: GameState = 'setup';
  private isFirstRivalTurn = false;
  private winnerId: PlayerIndex = '';
  private isLastAttackMiss = true;

  private static nextGameId = 1;
  private static games: Record<number, Game> = {};

  constructor(room: Room) {
    this.roomId = room.id;

    const [rival1, rival2] = room.players;
    this.rivals[rival1] = { playerName: rival1 };
    this.rivals[rival2] = { playerName: rival2 };

    this.gameId = Game.nextGameId;
    Game.nextGameId += 1;
    Game.games[this.gameId] = this;
  }

  get id(): number {
    return this.gameId;
  }

  get playersName(): string[] {
    return Object.keys(this.rivals);
  }

  static getGame(gameId: number): Game | undefined {
    return Game.games[gameId];
  }

  checkPlayer(name: string): boolean {
    return this.playersName.includes(name);
  }

  setPlayerShips(name: string, ships: Ship[]): boolean {
    const result = this.checkPlayer(name);
    if (result) {
      this.rivals[name].ships = ships;
      this.rivals[name].board = new Board(ships);
    }
    return result;
  }

  private checkShipsReadiness(): boolean {
    return Object.values(this.rivals).every(
      (rival) => rival.ships !== undefined
    );
  }
  checkGameOver(): boolean {
    return this.state === 'over';
  }

  start(): GameResponse<GameStartDTO | undefined>[] {
    if (!this.checkShipsReadiness()) {
      return [];
    }

    return Object.values(this.rivals)
      .filter((entry) => entry.playerName !== BOT_ID)
      .map(({ ships = [], playerName }) => {
        const data: GameStartDTO = {
          ships,
          currentPlayerIndex: playerName,
        };
        return { data, toPlayerName: playerName };
      });
  }

  private getCurrentTurnRival(): string {
    const idxRivalTurn = this.isFirstRivalTurn ? 0 : 1;
    return this.playersName[idxRivalTurn];
  }

  turn(): GameResponse<GameTurnDTO>[] {
    if (this.state === 'setup') {
      this.state = 'on';
    }
    if (this.isLastAttackMiss) {
      this.isFirstRivalTurn = !this.isFirstRivalTurn;
    }

    const currentPlayer = this.getCurrentTurnRival();

    const outputs: GameResponse<GameTurnDTO>[] = this.playersName
      .filter((rival) => rival !== BOT_ID)
      .map((rival) => {
        return {
          data: {
            currentPlayer,
          },
          toPlayerName: rival,
        };
      });

    return outputs;
  }

  getRival(attackerId: PlayerIndex): string {
    return this.playersName.filter((rival) => rival !== attackerId)[0];
  }

  attack(
    attackDTO: GameAttackDTO
  ): GameResponse<AttackFeedbackDTO | undefined>[] {
    const { indexPlayer, x, y } = attackDTO;
    const attackerId = indexPlayer as string;
    const position: Position = { x, y };

    const victimId = this.getRival(attackerId);

    const victimBoard = this.rivals[victimId].board;

    if (attackerId !== this.getCurrentTurnRival()) {
      const response: GameResponse<undefined> = {
        toPlayerName: attackerId,
        data: undefined,
      };
      return [response];
    }

    if (!victimBoard) {
      const response: GameResponse<undefined> = {
        toPlayerName: attackerId,
        data: undefined,
      };
      return [response];
    }

    const boardFeedbacks = victimBoard.attack(position);
    if (victimBoard.checkNoMoreShips()) {
      this.end(attackerId);
    }

    const responses: GameResponse<AttackFeedbackDTO>[] = [];

    boardFeedbacks.forEach((entry) => {
      const feedback: AttackFeedbackDTO = {
        ...entry,
        currentPlayer: attackerId,
      };

      if (attackerId !== BOT_ID) {
        const responseToAttacker: GameResponse<AttackFeedbackDTO> = {
          data: { ...feedback },
          toPlayerName: attackerId,
        };
        responses.push(responseToAttacker);
      }
      if (victimId !== BOT_ID) {
        const responseToVictim: GameResponse<AttackFeedbackDTO> = {
          data: { ...feedback },
          toPlayerName: victimId,
        };
        responses.push(responseToVictim);
      }
    });
    this.isLastAttackMiss = responses[0].data.status === 'miss';
    return responses;
  }

  private end(winnerId: PlayerIndex): void {
    this.state = 'over';
    this.winnerId = winnerId;
  }

  getRandomPositionForAttack(attackerId: PlayerIndex): Position {
    const victimId = this.getRival(attackerId);

    const victimBoard = this.rivals[victimId].board;
    const position = victimBoard
      ? victimBoard.getRandomPosition()
      : { x: 0, y: 0 };
    return position;
  }

  setBotShips(): boolean {
    return this.setPlayerShips(BOT_ID, BOT_SHIPS);
  }

  finish(): GameResponse<GameFinishDTO>[] {
    const rivals = this.checkGameOver() ? this.playersName : [];

    const responses: GameResponse<GameFinishDTO>[] = rivals.map((rival) => {
      return {
        data: {
          winPlayer: this.winnerId,
        },
        toPlayerName: rival,
      };
    });

    return responses;
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
