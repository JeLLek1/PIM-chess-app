import { User } from '../repositories/UserRepository';
import { RoomController } from '../controllers';
import { IncomingEventType } from './Messages';
import WebSocket from 'ws';

export const endpoints = new Map<
  IncomingEventType,
  (ws: WebSocket, user: User, payload: any) => void
>([
  [IncomingEventType.CREATE_ROOM, RoomController.createRoom],
  [IncomingEventType.JOIN_ROOM, RoomController.joinRoom],
  [IncomingEventType.LEAVE_ROOM, RoomController.leaveRoom],
  [IncomingEventType.START, RoomController.start],
  [IncomingEventType.MAKE_MOVE, RoomController.makeMove],
  [IncomingEventType.CHECK_FOR_MOVE, RoomController.checkForMove],
]);
