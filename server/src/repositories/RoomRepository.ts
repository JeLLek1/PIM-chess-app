import { generateRandomString } from "../utils/stringUtils";
import { getUserById } from "./UserRepository";

export type Room = {
  roomId: string;
  roomName: string;
  userId1: string | null;
  userId2: string | null;
};

const rooms: Room[] = [];

export function getRoomById(roomId: string): Room | null {
  const room = rooms.find(r => r.roomId === roomId);
  return room ? room : null;
}

export function saveRoom(room: Room): Room | null {
    const existingRoom = getRoomById(room.roomId);
    if (existingRoom === null) {
      rooms.push(room);
      return room;
    }
  return null;
}

export function deleteRoom(roomId: string): void {
  const roomIndex = rooms.findIndex(r => r.roomId === roomId);
  if (roomIndex >= 0) {
    rooms.splice(roomIndex, 1);
  }
}

export default {
  getRoomById: getRoomById,
  saveRoom: saveRoom,
  deleteRoom: deleteRoom,
}