export type IncomingMessage<T> = {
  type: IncomingEventType;
  data: T;
};

export enum IncomingEventType {
  CREATE_ROOM = 'CREATE_ROOM',
  JOIN_ROOM = 'JOIN_ROOM',
  LEAVE_ROOM = 'LEAVE_ROOM',
}

export type OutgoingMessage<T> = {
  type: OutgoingEventType;
  data: T;
};

export enum OutgoingEventType {
  USER_CREATED = 'USER_CREATED',
  ROOM_CREATED = 'ROOM_CREATED',
  JOINED_ROOM = 'JOINED_ROOM',
  ABANDONED_ROOM = 'ABANDONED_ROOM',
  PARTICIPANT_LEFT_ROOM = 'PARTICIPANT_LEFT_ROOM',
  LIST_ROOMS = 'LIST_ROOMS',
  ERROR = 'ERROR',
  DISCONECTED = 'DISCONECTED',
}

export function createOutgoingMessage<T>(
  eventType: OutgoingEventType,
  data: T,
): string {
  return JSON.stringify({
    type: eventType,
    data: data,
  });
}
