import { PieceType } from "../repositories/additionalTypes/Board";

export type CreateRoomPayload = {
  roomName: string;
};

export type JoinRoomPayload = {
  roomId: string;
};

export type LeaveRoomPayload = {
  roomId: string;
};

export type StartGamePayload = {
  roomId: string;
};

export type PieceMovePayload = {
  roomId: string;
  from: string;
  to: string;
  promotion?: PieceType;
};