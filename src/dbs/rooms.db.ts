import { Room, RoomState, RoomUser } from '../models/index.js';

type Rooms = {
  [id: number]: Room;
};

class RoomsDB {
  private nextRoomId = 1;
  private rooms: Rooms = {};

  add(name: string): Room | null {
    const id = this.nextRoomId;
    this.nextRoomId += 1;

    this.rooms[id] = { id, players: [name] };
    return this.get(id);
  }

  get(id: number): Room | null {
    const room = this.rooms[id];
    if (room) {
      return { ...room };
    }

    return null;
  }

  delete(id: number): Room | null {
    const room = this.get(id);
    if (room) {
      delete this.rooms[id];
    }

    return room;
  }

  getRoomsSinglePlayer(): RoomState[] {
    return Object.values(this.rooms)
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

  private checkTwoPlayers(roomId: number): boolean {
    const room = this.get(roomId);
    if (room) {
      return room.players.length === 2;
    }
    return false;
  }

  addPlayerToRoom(name: string, roomId: number): Room | null {
    if (!this.checkTwoPlayers(roomId)) {
      this.rooms[roomId].players.push(name);
      return this.get(roomId);
    }
    return null;
  }
}

export const roomsDB = new RoomsDB();
