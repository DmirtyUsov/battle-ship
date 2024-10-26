import { GameRival, GameStart, GameTurn, Room, Ship } from './models/index.js';

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

  turn(): GameTurn {
    const rivals = Object.keys(this.rivals);
    if (this.state === 'setup') {
      this.state = 'on';
    }

    this.isFirstRivalInAttack = !this.isFirstRivalInAttack;

    return {
      currentPlayer: rivals[this.isFirstRivalInAttack ? 0 : 1],
    };
  }
}
