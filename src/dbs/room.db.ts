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

  addPlayer(roomId: number, name: string): Room | undefined {
    if (!this.checkTwoPlayers(roomId)) {
      const room = this.get(roomId);
      if (room) {
        room.players.push(name);
        return this.update(roomId, room);
      }
    }
    return undefined;
  }

  private checkTwoPlayers(roomId: number): boolean {
    const room = this.get(roomId);
    if (room) {
      return room.players.length === 2;
    }
    return false;
  }
}

export const roomDB = new RoomDB();
