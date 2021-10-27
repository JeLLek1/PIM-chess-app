export type IncomingMessage<T> = {
  type: IncomingEventType;
  data: T;
};

export enum IncomingEventType {
  CREATE_ROOM = 'CREATE_ROOM',
  JOIN_ROOM = 'JOIN_ROOM',
  LEAVE_ROOM = 'LEAVE_ROOM',
  PLAYER_READY = 'PLAYER_READY',
  MAKE_MOVE = "MAKE_MOVE",
  START = 'START', // for tests
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
  PARTICIPANT_JOINED_ROOM = 'PARTICIPANT_JOINED_ROOM',
  PARTICIPANT_ABANDONED_ROOM = 'PARTICIPANT_ABANDONED_ROOM',
  LIST_ROOMS = 'LIST_ROOMS',
  ERROR = 'ERROR',
  DISCONNECTED = 'DISCONNECTED',
  GAME_STARTED = 'GAME_STARTED',
  BOARD_UPDATED = 'BOARD_UPDATED',
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
