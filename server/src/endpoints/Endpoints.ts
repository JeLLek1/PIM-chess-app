import { User } from '../repositories/UserRepository';
import { RoomController } from '../controllers';
import WebSocket from 'ws';

export type ControlerMethod = (ws: WebSocket, user: User, payload: any) => void;

export interface IEndpoint {
  method: ControlerMethod;
}

export interface IEndpoints {
  [key: string]: IEndpoint;
}

export const endpoints: IEndpoints = {
  CREATE_ROOM: {
    method: RoomController.createRoom,
  },
  JOIN_ROOM: {
    method: RoomController.joinRoom,
  },
  LEAVE_ROOM: {
    method: RoomController.leaveRoom,
  },
};
