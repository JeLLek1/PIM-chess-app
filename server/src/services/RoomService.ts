import RoomRepository, { Room } from '../repositories/RoomRepository';
import { User, UserPublic } from '../repositories/UserRepository';
import { v4 as uuidv4 } from 'uuid';
import { Board, BoardElement, PieceType, positionToIndex } from '../repositories/additionalTypes/Board';

export function createRoom(roomName: string): Room | null {
  const newId = uuidv4();
  const newRoom = {
    roomId: newId,
    roomName: roomName,
    user1: null,
    user2: null,
    boardData: null,
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
  if (room.user1 === null && room.user2 === null) {
    RoomRepository.deleteRoom(room.roomId);
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
  room.boardData = {
    board: Array(8).fill(null).map(() => Array(8).fill(null)),
  }

  function generatePawns(color: "w" | "b"): BoardElement[] {
    const arr = Array(8).fill(null);
    return arr.map(() => {
      return {
        color: color,
        type: "pawn",
      }
    });
  }

  room.boardData.board[1] = generatePawns("w");
  room.boardData.board[6] = generatePawns("b");

  function generateOuterRows(color: "w" | "b"): BoardElement[] {
    const arr = Array(8).fill(null);
    return arr.map((el, i) => {
      let type: PieceType = "pawn";
      if (i === 0 || i === 7) type = "rook";
      else if (i === 1 || i === 6) type = "knight";
      else if (i === 2 || i === 5) type = "bishop";
      else if (i === 3) type = "queen";
      else type = "king";
  
      return {
        color: color,
        type: type,
      }
    });
  }

  room.boardData.board[0] = generateOuterRows("w");
  room.boardData.board[7] = generateOuterRows("b");

  return room;
}

export function getUsersOfRoom(room : Room): User[] {
  const existingRoom = room;
  if (existingRoom !== null) {
    return [existingRoom.user1, existingRoom.user2].filter(user => user !== null);
  }
  return [];
}

export function movePiece(board : Board, from: string, to: string): void {
  if (!board) return; 
  const initPos = positionToIndex(from);
  const movePos = positionToIndex(to);
  
  const piece = board[initPos[0]][initPos[1]];
  board[initPos[0]][initPos[1]] = null;
  board[movePos[0]][movePos[1]] = piece;
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
};
