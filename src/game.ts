import { GameRival, Room } from './models/index.js';

type GameRivals = { [id: string]: GameRival };
export class Game {
  private rivals: GameRivals = {};
  constructor(room: Room) {
    const [rival1, rival2] = room.players;
    this.rivals[rival1] = { playerName: rival1 };
    this.rivals[rival2] = { playerName: rival2 };
  }

  getRivals(): string[] {
    return Object.keys(this.rivals);
  }
}
