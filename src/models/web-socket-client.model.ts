import { WebSocket } from 'ws';
export interface WebSocketClient extends WebSocket {
  id: number;
  linkedPlayerName?: string;
}
