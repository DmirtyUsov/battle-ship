import {
  Player,
  PlayersDBOutput,
} from '../models/index.js';

type Players = { [name: string]: Player };

class PlayersDB {
  private players: Players = {};

  get(name: string): PlayersDBOutput {
    let player: PlayersDBOutput = null;

    if (this.players[name]) {
      player = { ...this.players[name] };
    }

    return player;
  }

  add(newPlayer: Player): PlayersDBOutput {
    if (this.get(newPlayer.name)) {
      return null;
    }
    this.players[newPlayer.name] = { ...newPlayer };

    return { ...newPlayer };
  }

  setClient(name: string, clientId: number | undefined): PlayersDBOutput {
    let player = this.get(name);

    if (player) {
      this.players[name].clientId = clientId;
      player = { ...this.players[name] };
    }

    return player;
  }

  setRoom(name: string, roomId: number | undefined): PlayersDBOutput {
    let player = this.get(name);

    if (player) {
      this.players[name].roomId = roomId;
      player = { ...this.players[name] };
    }

    return player;
  }

  checkHasRoom(name: string): boolean {
    const player = this.get(name);

    if (player) {
      return this.players[name].roomId === undefined ? false : true;
    }
    return false;
  }

  checkExists(name: string): boolean {
    return this.get(name) ? true : false;
  }
}

export const playersDB = new PlayersDB();
