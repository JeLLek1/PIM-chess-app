import WebSocket from 'ws';
import parse from 'url-parse';
import { UserService, RoomService } from '../services';
import ConnectionRepository, {
  saveConnection,
} from '../repositories/ConnectionRepository';
import {
  createOutgoingMessage,
  IncomingEventType,
  IncomingMessage,
  OutgoingEventType,
} from './Messages';
import {
  CreateRoomPayload,
  JoinRoomPayload,
  LeaveRoomPayload,
} from './PayloadsTypes';
import { ValidationError } from '../utils';
import { RoomController } from '../controllers';

const wss = new WebSocket.Server({
  noServer: true,
});

wss.on('connection', (ws, request) => {
  const url = parse(request.url);
  const userName = url.pathname.substr(1).split('/')[0];

  const user = UserService.createUser(userName);

  if (user === null) {
    sendError(ws, 'Internal error');
    ws.close();
  }
  saveConnection(user.userId, ws);
  ws.send(createOutgoingMessage(OutgoingEventType.USER_CREATED, user));
  ws.send(
    createOutgoingMessage(
      OutgoingEventType.LIST_ROOMS,
      RoomService.getRoomsList(),
    ),
  );

  ws.on('close', () => {
    RoomController.leaveAllRooms(user);
    ConnectionRepository.deleteConnection(user.userId);
    UserService.removeUser(user.userId);
  });

  ws.on('message', data => {
    let message: IncomingMessage<null> | null = null;

    try {
      message = JSON.parse(data.toString()) as IncomingMessage<null>;
    } catch (e) {
      sendError(ws, 'Wrong format');
      return;
    }
    try {
      switch (message.type) {
        case IncomingEventType.CREATE_ROOM: {
          RoomController.createRoom(
            ws,
            user,
            (message as IncomingMessage<CreateRoomPayload>).data,
          );
          break;
        }
        case IncomingEventType.JOIN_ROOM: {
          RoomController.joinRoom(
            ws,
            user,
            (message as IncomingMessage<JoinRoomPayload>).data,
          );
          break;
        }
        case IncomingEventType.LEAVE_ROOM: {
          RoomController.leaveRoom(
            ws,
            user,
            (message as IncomingMessage<LeaveRoomPayload>).data,
          );
          break;
        }
        default: {
          throw new ValidationError('Invalid event type');
        }
      }
    } catch (e) {
      if (e instanceof ValidationError) {
        sendError(ws, (e as Error).message);
      } else {
        console.log(e);
        sendError(ws, 'Internal error');
      }
    }
  });
});

const sendError = (ws, message) => {
  ws.send(createOutgoingMessage(OutgoingEventType.ERROR, message));
};

export default wss;
