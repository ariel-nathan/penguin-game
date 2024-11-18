export type WebSocketEventType = "event";

export interface WebSocketEvent {
  type: WebSocketEventType;
  payload: any;
}
