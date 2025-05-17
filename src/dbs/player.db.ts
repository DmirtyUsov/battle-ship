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
}

export const playerDB = new PlayerDB();
