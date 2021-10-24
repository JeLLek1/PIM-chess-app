export type CreateRoomPayload = {
  roomName: string;
};

export type JoinRoomPayload = {
  roomId: string;
};

export type LeaveRoomPayload = {
  roomId: string;
};
