import { Game } from '../game.js';
import { Room } from '../models/index.js';

type Games = { [id: number]: Game };

class GamesDB {
  private nextGameId = 1;
  private games: Games = {};

  createGameForRoom(room: Room): number {
    const id = this.nextGameId;
    this.nextGameId += 1;

    this.games[id] = new Game(room);
    return id;
  }

  get(id: number): Game {
    return this.games[id];
  }

  delete(id: number): boolean {
    if (this.get(id)) {
      delete this.games[id];
      return true;
    }
    return false;
  }
}

export const gamesDB = new GamesDB();
