import { Board } from './board';
import { GameStartDTO, Rival, Room, Ship } from './models';

export class Game {
  private rivals: Record<string, Rival> = {};
  private readonly roomId: number;
  private readonly gameId: number;
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

  getGameStartData(): GameStartDTO[] {
    return Object.values(this.rivals).map(({ ships = [], playerName }) => {
      const data: GameStartDTO = {
        ships,
        currentPlayerIndex: playerName,
      };
      return data;
    });
  }
}
