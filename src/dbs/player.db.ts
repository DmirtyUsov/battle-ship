import { LoginDTO, Player } from '../models';
import { MapDB } from './map-db';

class PlayerDB extends MapDB<string, Player> {
  add(loginDTO: LoginDTO): Player | undefined {
    const { name, password } = loginDTO;
    const player = this.get(name);
    if (player) {
      return undefined;
    }
    const newPlayer: Player = { name, password };
    this.update(name, newPlayer);
    return newPlayer;
  }
  setClientId(name: string, clientId: number | undefined): Player | undefined {
    const player = this.get(name);
    if (!player) {
      return undefined;
    }
    return this.update(name, { ...player, clientId });
  }
  setRoomId(name: string, roomId: number | undefined): Player | undefined {
    const player = this.get(name);
    if (!player) {
      return undefined;
    }
    return this.update(name, { ...player, roomId });
  }

  checkHasRoom(name: string): boolean {
    const player = this.get(name);

    if (player) {
      return player.roomId === undefined ? false : true;
    }
    return false;
  }
}

export const playerDB = new PlayerDB();
