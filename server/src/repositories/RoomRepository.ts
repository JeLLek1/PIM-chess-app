export type Room = {
  roomId: string;
  roomName: string;
  user1: {
    id: string;
    name: string;
  } | null;
  user2: {
    id: string;
    name: string;
  } | null;
};

const rooms = new Map<string, Room>();

export function getRoomById(roomId: string): Room | null {
  const room = rooms.get(roomId);
  return room ? room : null;
}

export function getRoomsByUserId(userId: string): Room[] {
  const roomsFound: Room[] = [];
  rooms.forEach(room => {
    if (room.user1?.id === userId || room.user2?.id == userId) {
      roomsFound.push(room);
    }
  });
  return roomsFound;
}

export function saveRoom(room: Room): Room | null {
  const existingRoom = getRoomById(room.roomId);
  if (existingRoom === null) {
    rooms.set(room.roomId, room);
    return room;
  }
  return null;
}

export function deleteRoom(roomId: string): boolean {
  return rooms.delete(roomId);
}

export function getAllRooms(): Room[] {
  return Array.from(rooms, ([_, room]) => room);
}

export default {
  getRoomById,
  saveRoom,
  deleteRoom,
  getAllRooms,
  getRoomsByUserId,
};
