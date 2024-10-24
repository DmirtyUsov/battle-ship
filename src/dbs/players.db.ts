import { Player, PlayersDBOutput, WebSocketWithId } from '../models/index.js';

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

  setClient(
    name: string,
    client: WebSocketWithId | undefined,
  ): PlayersDBOutput {
    let player = this.get(name);

    if (player) {
      this.players[name].client = client;
      player = { ...this.players[name] };
    }

    return player;
  }
}

export const playersDB = new PlayersDB();
