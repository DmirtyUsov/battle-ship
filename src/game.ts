import { Board } from './board';
import {
  GameResponse,
  GameStartDTO,
  GameTurnDTO,
  Rival,
  Room,
  Ship,
} from './models';

type GameState = 'setup' | 'on' | 'over';

export class Game {
  private rivals: Record<string, Rival> = {};
  private readonly roomId: number;
  private readonly gameId: number;
  private state: GameState = 'setup';
  private isFirstRivalTurn = true;

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

  checkShipsReadiness(): boolean {
    return Object.values(this.rivals).every(
      (rival) => rival.ships !== undefined
    );
  }

  start(): GameResponse<GameStartDTO>[] {
    return Object.values(this.rivals).map(({ ships = [], playerName }) => {
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
    this.isFirstRivalTurn = !this.isFirstRivalTurn;

    const currentPlayer = this.getCurrentTurnRival();

    const outputs: GameResponse<GameTurnDTO>[] = this.playersName.map(
      (rival) => {
        return {
          data: {
            currentPlayer,
          },
          toPlayerName: rival,
        };
      }
    );

    return outputs;
  }
}
