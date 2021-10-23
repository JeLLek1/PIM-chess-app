import { Room, getRoomById, saveRoom, deleteRoom } from "../repositories/RoomRepository";
import { getUserById } from "../repositories/UserRepository";
import { generateRandomString } from "../utils/stringUtils";

export function createRoom(roomName: string): Room | null {
  for (let i = 0; i < 10; i++) {
    const newId = generateRandomString(32);
    const newRoom = { 
      roomId: newId,
      roomName: roomName,
      userId1: null,
      userId2: null
    };
    const roomFromRep = saveRoom(newRoom);
    if (roomFromRep) {
      return newRoom;
    }
  }
  return null;
}


export function addUserToRoom(roomId: string, userId: string): void {
  const room = getRoomById(roomId);
  if (room === null) {
    throw new Error("Room doesn't exist.");
  }

  const user = getUserById(userId);
  if (user === null) {
    throw new Error("User doesn't exist.");
  }

  if (room.userId1 !== null && room.userId2 !== null) {
    throw new Error("Room is full.");
  }

  if (room.userId1 !== null) {
    room.userId2 = userId
  } else {
    room.userId1 = userId
  }
}

export function removeUserFromRoom(roomId: string, userId: string): void {
  const room = getRoomById(roomId);
  if (room === null) {
    throw new Error("Room doesn't exist.");
  }

  if (room.userId1 === userId) {
    room.userId1 = null;
  }
  if (room.userId2 === userId) {
    room.userId2 = null;
  }
}

export function findRoom(roomId: string): Room | null {
  return getRoomById(roomId);
}

export function removeRoom(roomId: string): void {
  deleteRoom(roomId);
}

export default {
  createRoom: createRoom,
  addUserToRoom: addUserToRoom,
  removeUserFromRoom: removeUserFromRoom,
  findRoom: findRoom,
  removeRoom: removeRoom,
}