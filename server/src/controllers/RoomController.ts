import {
  CreateRoomPayload,
  JoinRoomPayload,
  LeaveRoomPayload,
  PieceMovePayload,
  StartGamePayload,
} from '../endpoints/PayloadsTypes';
import RoomService, { createBoard } from '../services/RoomService';
import WebSocket from 'ws';
import { ValidationError, broadcastMessage } from '../utils';
import { User } from '../repositories/UserRepository';
import {
  createOutgoingMessage,
  OutgoingEventType,
} from '../endpoints/Messages';
import ConnectionRepository, { getConnectionById } from '../repositories/ConnectionRepository';
import RoomRepository, { Room } from '../repositories/RoomRepository';
import { UserService } from '../services';
import { positionToIndex } from '../repositories/additionalTypes/Board';

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
  const room = RoomService.findRoom(payload.roomId);
  if (room) {
    createBoard(room);
    getConnectionsOfRoom(room).forEach((ws, i) => {
      ws.send(createOutgoingMessage(
        OutgoingEventType.GAME_STARTED,
        room.boardData.board,
      ));
    });
  }
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
  const room = RoomService.findRoom(payload.roomId);
  const board = room.boardData.board;
  if (board) {
    RoomService.movePiece(board, payload.from, payload.to);
    getConnectionsOfRoom(room).forEach((ws, i) => {
      ws.send(createOutgoingMessage(
        OutgoingEventType.BOARD_UPDATED,
        room.boardData.board,
      ));
    });
  }
}

function getConnectionsOfRoom(room: Room): WebSocket[] {
  console.log(RoomService.getUsersOfRoom(room))
  return ConnectionRepository.getConnections(UserService.getIdsFromUsers(RoomService.getUsersOfRoom(room)))
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
