import {
  CreateRoomPayload,
  JoinRoomPayload,
  LeaveRoomPayload,
} from '../endpoints/PayloadsTypes';
import RoomService from '../services/RoomService';
import WebSocket from 'ws';
import { ValidationError, broadcastMessage } from '../utils';
import { User } from '../repositories/UserRepository';
import {
  createOutgoingMessage,
  IncomingEventType,
  IncomingMessage,
  OutgoingEventType,
} from '../endpoints/Messages';
import { getConnectionById } from '../repositories/ConnectionRepository';

export function createRoom(
  ws: WebSocket,
  user: User,
  payload: CreateRoomPayload,
): void {
  if (!payload || typeof payload.roomName !== 'string') {
    throw new ValidationError('Wrong format');
  }
  const room = RoomService.createRoom(payload.roomName);
  if (room === null) {
    throw new ValidationError('Error during room creation');
  }
  RoomService.addUserToRoom(room, user);
  ws.send(createOutgoingMessage(OutgoingEventType.ROOM_CREATED, room));
  broadcastMessage(OutgoingEventType.LIST_ROOMS, RoomService.getRoomsList());
}

export function joinRoom(
  ws: WebSocket,
  user: User,
  payload: JoinRoomPayload,
): void {
  if (!payload || typeof payload.roomId !== 'string') {
    throw new ValidationError('Wrong format');
  }
  const room = RoomService.findRoom(payload.roomId);
  if (room === null) {
    throw new ValidationError("Room doesn't exist.");
  }
  const remainingUser = room.user1?.id || room.user2?.id;
  if (!RoomService.addUserToRoom(room, user)) {
    throw new ValidationError('Room is full.');
  }
  if (remainingUser !== null) {
    const remainingWs = getConnectionById(remainingUser);
    if (remainingWs) {
      remainingWs.send(
        createOutgoingMessage(OutgoingEventType.PARTICIPANT_JOINED_ROOM, room),
      );
    }
  }
  ws.send(createOutgoingMessage(OutgoingEventType.JOINED_ROOM, room));
  broadcastMessage(OutgoingEventType.LIST_ROOMS, RoomService.getRoomsList());
}

export function leaveRoom(
  ws: WebSocket,
  user: User,
  payload: LeaveRoomPayload,
): void {
  if (!payload || typeof payload.roomId !== 'string') {
    throw new ValidationError('Wrong format');
  }

  const room = RoomService.findRoom(payload.roomId);
  if (room === null) {
    throw new ValidationError("Room doesn't exist.");
  }
  if (!RoomService.removeUserFromRoom(room, user)) {
    throw new ValidationError("You don't belong to this room.");
  }
  const remainingUser = room.user1?.id || room.user2?.id;
  if (remainingUser !== null) {
    const remainingWs = getConnectionById(remainingUser);
    if (remainingWs) {
      remainingWs.send(
        createOutgoingMessage(
          OutgoingEventType.PARTICIPANT_ABANDONED_ROOM,
          room,
        ),
      );
    }
  }
  ws.send(createOutgoingMessage(OutgoingEventType.ABANDONED_ROOM, null));
  broadcastMessage(OutgoingEventType.LIST_ROOMS, RoomService.getRoomsList());
}

export function leaveAllRooms(user: User) {
  const rooms = RoomService.getRoomsByUser(user);
  if (!rooms.length) return;
  rooms.forEach(room => {
    RoomService.removeUserFromRoom(room, user);
    const remainingUser = room.user1?.id || room.user2?.id;
    if (remainingUser !== null) {
      const remainingWs = getConnectionById(remainingUser);
      if (remainingWs) {
        remainingWs.send(
          createOutgoingMessage(
            OutgoingEventType.PARTICIPANT_ABANDONED_ROOM,
            room,
          ),
        );
      }
    }
  });
  broadcastMessage(OutgoingEventType.LIST_ROOMS, RoomService.getRoomsList());
}

export default {
  createRoom,
  joinRoom,
  leaveRoom,
  leaveAllRooms,
};
