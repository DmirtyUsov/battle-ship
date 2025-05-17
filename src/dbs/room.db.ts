import { Room } from '../models';
import { MapDB } from './map-db';

class RoomDB extends MapDB<number, Room> {
  private nextRoomId: number = 1;

  create(name: string): Room | undefined {
    const id = this.nextRoomId;
    this.nextRoomId += 1;
    const newRoom: Room = { id, players: [name] };
    return this.update(id, newRoom);
  }
}

export const roomDB = new RoomDB();
