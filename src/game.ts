import { GameRival, Room, Ship } from './models/index.js';

type RivalIndex = string | number;
type GameRivals = { [id: RivalIndex]: GameRival };

export class Game {
  private rivals: GameRivals = {};
  constructor(room: Room) {
    const [rival1, rival2] = room.players;
    this.rivals[rival1] = { playerName: rival1 };
    this.rivals[rival2] = { playerName: rival2 };
  }

  getRivals(): RivalIndex[] {
    return Object.keys(this.rivals);
  }

  checkRival(name: RivalIndex): boolean {
    return this.getRivals().includes(name);
  }

  setRivalShips(name: RivalIndex, ships: Ship[]): boolean {
    const result = this.checkRival(name);
    if (result) {
      this.rivals[name].ships = ships;
    }
    return result;
  }
}
