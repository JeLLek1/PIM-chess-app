import RoomRepository, { Room } from '../repositories/RoomRepository';
import { User } from '../repositories/UserRepository';
import { v4 as uuidv4 } from 'uuid';

export function createRoom(roomName: string): Room | null {
  const newId = uuidv4();
  const newRoom = {
    roomId: newId,
    roomName: roomName,
    user1: null,
    user2: null,
  };
  const roomFromRep = RoomRepository.saveRoom(newRoom);
  if (!roomFromRep) {
    return null;
  }
  return roomFromRep;
}

export function addUserToRoom(room: Room, user: User): boolean {
  const roomUser = {
    id: user.userId,
    name: user.userName,
  };

  if (room.user1 === null) {
    room.user1 = roomUser;
  } else if (room.user2 === null) {
    room.user2 = roomUser;
  } else {
    return false;
  }
  return true;
}

export function removeUserFromRoom(room: Room, user: User): void {
  if (room.user1.id === user.userId) {
    room.user1 = null;
  } else if (room.user2.id === user.userId) {
    room.user2 = null;
  }
  if (room.user1 === null && room.user2 === null) {
    RoomRepository.deleteRoom(room.roomId);
  }
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

export default {
  createRoom,
  addUserToRoom,
  removeUserFromRoom,
  findRoom,
  removeRoom,
  getRoomsList,
  getRoomsByUser,
};
