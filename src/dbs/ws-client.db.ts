import { MapDB } from './map-db';
import { WebSocketClient } from '../models';

class WsClientDB extends MapDB<number, WebSocketClient> {
  private nextClientId: number = 0;

  add(item: WebSocketClient): WebSocketClient {
    item.id = this.nextClientId;
    const newItem = this.update(this.nextClientId, item);
    this.nextClientId += 1;
    return newItem;
  }
}

export const wsClientDB = new WsClientDB();
