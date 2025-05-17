import { Room, RoomState, RoomUser } from '../models';
import { MapDB } from './map-db';

class RoomDB extends MapDB<number, Room> {
  private nextRoomId: number = 1;

  create(name: string): Room | undefined {
    const id = this.nextRoomId;
    this.nextRoomId += 1;
    const newRoom: Room = { id, players: [name] };
    return this.update(id, newRoom);
  }

  getRoomsOnePlayer(): RoomState[] {
    return this.list()
      .filter((entry) => entry.players.length === 1)
      .map((entry) => {
        const state: RoomState = {
          roomId: entry.id,
          roomUsers: Object.entries(entry.players).map((player) => {
            const roomUser: RoomUser = { index: +player[0], name: player[1] };
            return roomUser;
          }),
        };
        return state;
      });
  }
}

export const roomDB = new RoomDB();
