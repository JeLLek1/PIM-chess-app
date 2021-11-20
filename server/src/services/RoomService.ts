import RoomRepository, { Room } from '../repositories/RoomRepository';
import { User, UserPublic } from '../repositories/UserRepository';
import { v4 as uuidv4 } from 'uuid';
import {
  Color,
  positionToIndex,
  getOpositeColor,
  PieceType,
} from '../repositories/additionalTypes/Board';
import Chess from '../Chess';

export function createRoom(roomName: string): Room | null {
  const newId = uuidv4();
  const newRoom: Room = {
    roomId: newId,
    roomName: roomName,
    user1: null,
    user2: null,
    boardData: null,
    user1Color: Math.random() >= 0.5 ? 'b' : 'w',
  };
  const roomFromRep = RoomRepository.saveRoom(newRoom);
  if (!roomFromRep) {
    return null;
  }
  return roomFromRep;
}

export function addUserToRoom(room: Room, user: User): boolean {
  const roomUser: UserPublic = user;

  if (room.user1 === null) {
    room.user1 = roomUser;
  } else if (room.user2 === null) {
    room.user2 = roomUser;
  } else {
    return false;
  }
  return true;
}

export function removeUserFromRoom(room: Room, user: User): boolean {
  if (room.user1?.userId === user.userId) {
    room.user1 = null;
  } else if (room.user2?.userId === user.userId) {
    room.user2 = null;
  } else {
    return false;
  }
  if (room.user1 === null){
    if(room.user2 === null){
      RoomRepository.deleteRoom(room.roomId);
    }else{
      // change main player of the room
      room.user1 = room.user2;
      room.user2 = null;
      room.user1Color = getOpositeColor(room.user1Color);
    }
  }
  return true;
}

export function findRoom(roomId: string): Room | null {
  return RoomRepository.getRoomById(roomId);
}

export function removeRoom(roomId: string): void {
  RoomRepository.deleteRoom(roomId);
}

export function getRoomsList(): Room[] {
  return RoomRepository.getAllRooms();
}

export function getRoomsByUser(user: User): Room[] {
  return RoomRepository.getRoomsByUserId(user.userId);
}

export function createBoard(room : Room): Room {
  room.boardData = Chess.createDefaultPosition();

  return room;
}

export function getUsersOfRoom(room : Room): User[] {
  const existingRoom = room;
  if (existingRoom !== null) {
    return [existingRoom.user1, existingRoom.user2].filter(user => user !== null);
  }
  return [];
}

export function getUserColor(room: Room, user: User): Color|null {
  if(room.user1.userId === user.userId){
    return room.user1Color;
  }else if(room.user2.userId === user.userId){
    return getOpositeColor(room.user1Color);
  }
  return null;
}

export function movePiece(
  room: Room,
  user: User,
  from: string,
  to: string,
  promotion?: PieceType,
): boolean {
  if (!room?.boardData?.board) return false;

  const color = getUserColor(room, user);
  if (room.boardData.turnColor !== color) {
    return false;
  }

  const initPos = positionToIndex(from);
  const movePos = positionToIndex(to);

  if (!Chess.makeMove(room.boardData, initPos, movePos, promotion)) {
    return false;
  }

  return true;
}

export function possibleMoves(
  room: Room,
  from: string,
): any {
  const pos = positionToIndex(from);
  if (!room.boardData) throw new Error("Game not started.")
  else {
    return {
      position: from,
      movesBoard: Chess.getPossibleMoves(room.boardData, pos)
    };
  }
}

export default {
  createRoom,
  addUserToRoom,
  removeUserFromRoom,
  findRoom,
  removeRoom,
  getRoomsList,
  getRoomsByUser,
  createBoard,
  getUsersOfRoom,
  movePiece,
  possibleMoves,
};
