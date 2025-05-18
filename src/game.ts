import { Rival, Room } from './models';

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
}
