import { Room, RoomsDBOutput, RoomState, RoomUser } from '../models/index.js';

type Rooms = {
  [id: number]: Room;
};

class RoomsDB {
  private nextRoomId = 1;
  private rooms: Rooms = {};

  add(name: string): RoomsDBOutput {
    const id = this.nextRoomId;
    this.nextRoomId += 1;

    this.rooms[this.nextRoomId] = { id, players: [name] };
    return this.get(id);
  }

  get(id: number): RoomsDBOutput {
    const room = this.rooms[id];
    if (room) {
      return { ...room };
    }
    return null;
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
}

export const roomsDB = new RoomsDB();
