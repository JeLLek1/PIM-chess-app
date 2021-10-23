
export type IncomingMessage = {
  type: IncomingEventType,
  data: any,
}

export enum IncomingEventType {
  CREATE_ROOM = 'CREATE_ROOM',
  JOIN_ROOM = 'JOIN_ROOM',
}

export type OutgoingMessage = {
  type: OutgoingEventType,
  data: any,
}

export enum OutgoingEventType {
  USER_CREATED = 'USER_CREATED',
  ROOM_CREATED = 'ROOM_CREATED',
  JOINED_ROOM = 'JOINED_ROOM',
  ERROR = 'ERROR',
}

export function createOutgoingMessage(eventType: OutgoingEventType, data: any): string {
  return JSON.stringify({
    type: eventType,
    data: data,
  });
}
