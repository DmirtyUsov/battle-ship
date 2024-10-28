import { Winner } from '../models/index.js';

type Winners = { [name: string]: number };

class WinnersDB {
  private winners: Winners = {};

  addWin(name: string): void {
    const wins = this.winners[name];
    this.winners[name] = wins === undefined ? 1 : wins + 1;
  }

  getAll(): Winner[] {
    const winners: Winner[] = Object.entries(this.winners).map(
      ([key, value]) => {
        return { name: key, wins: value };
      },
    );
    return winners;
  }
}

export const winnersDB = new WinnersDB();
