import {
  CreateRoomPayload,
  JoinRoomPayload,
  LeaveRoomPayload,
  PieceMovePayload,
  StartGamePayload,
} from '../endpoints/PayloadsTypes';
import RoomService, { createBoard } from '../services/RoomService';
import WebSocket from 'ws';
import { ValidationError, broadcastMessage, sendToRoommates } from '../utils';
import { User } from '../repositories/UserRepository';
import {
  createOutgoingMessage,
  OutgoingEventType,
} from '../endpoints/Messages';
import ConnectionRepository, { getConnectionById } from '../repositories/ConnectionRepository';
import { UserService } from '../services';

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
  const remainingUser = room.user1?.userId || room.user2?.userId;
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
  const remainingUser = room.user1?.userId || room.user2?.userId;
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
    const remainingUser = room.user1?.userId || room.user2?.userId;
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

export function start(
  ws: WebSocket,
  user: User,
  payload: StartGamePayload,
): void {
  
  if (!payload || typeof payload.roomId !== 'string') {
    throw new ValidationError('Wrong format');
  }
  const room = RoomService.findRoom(payload.roomId);
  if (!room) {
    throw new ValidationError("Room doesn't exist.");
  }
  if(room.user1 === null || room.user2 === null){
    throw new ValidationError(
      'Game can\'t start without two players',
    );
  }
  if (room.user1.userId !== user.userId){
    throw new ValidationError(
      'Only the user who created the room can start the game',
    );
  }
  if (room.boardData !== null){
    throw new ValidationError('The game has already started');
  }
  createBoard(room);
  sendToRoommates(
    room,
    OutgoingEventType.GAME_STARTED,
    room,
  );
}

export function playerReady(
  ws: WebSocket,
  user: User,
  payload: any,
): void {

}

export function makeMove(
  ws: WebSocket,
  user: User,
  payload: PieceMovePayload,
): void {
  if (
    !payload ||
    typeof payload.roomId !== 'string' ||
    typeof payload.from !== 'string' ||
    typeof payload.to !== 'string' ||
    !["string", "undefined"].includes(typeof payload.promotion)
  ) {
    throw new ValidationError('Wrong format');
  }
  const room = RoomService.findRoom(payload.roomId);
  if (!room) {
    throw new ValidationError("Room doesn't exist.");
  }
  if (room.user1 === null || room.user2 === null) {
    throw new ValidationError("Game can't run without two players");
  }
  if (room.boardData === null) {
    throw new ValidationError('The game has not started yet');
  }
  if (!RoomService.movePiece(room, user, payload.from, payload.to, payload.promotion)) {
    throw new ValidationError('Illegal move');
  }
  sendToRoommates(room, OutgoingEventType.BOARD_UPDATED, {
    room,
    from: payload.from,
    to: payload.to,
    promotion: payload.promotion,
  });
}

export default {
  createRoom,
  joinRoom,
  leaveRoom,
  leaveAllRooms,
  start,
  playerReady,
  makeMove,
};
