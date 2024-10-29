import { Player, PlayersDBOutput, WebSocketExt } from '../models/index.js';

type Players = { [name: string]: Player };
type Clients = { [name: string]: WebSocketExt | undefined };

class PlayersDB {
  private players: Players = {};
  private clients: Clients = {};

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

  setClient(name: string, client: WebSocketExt | undefined): PlayersDBOutput {
    let player = this.get(name);

    if (player) {
      this.clients[name] = client;
      this.players[name].clientId = client?.id;
      player = { ...this.players[name] };
    }

    return player;
  }

  getClient(name: string): WebSocketExt | undefined {
    return this.clients[name];
  }

  setRoom(name: string, roomId: number | undefined): PlayersDBOutput {
    let player = this.get(name);

    if (player) {
      this.players[name].roomId = roomId;
      player = { ...this.players[name] };
    }

    return player;
  }

  setGame(name: string, gameID: number | undefined): PlayersDBOutput {
    let player = this.get(name);

    if (player) {
      this.players[name].gameId = gameID;
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

  getGameId(name: string): number | undefined {
    const player = this.get(name);
    if (player) {
      return this.players[name].gameId;
    }
    return undefined;
  }

  checkExists(name: string): boolean {
    return this.get(name) ? true : false;
  }
}

export const playersDB = new PlayersDB();
