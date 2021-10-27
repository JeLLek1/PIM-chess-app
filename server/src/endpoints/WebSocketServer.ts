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
import { CreateRoomPayload } from './PayloadsTypes';
import { ValidationError } from '../utils';
import { RoomController } from '../controllers';
import { endpoints } from './Endpoints';

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
    let message: IncomingMessage<any> | null = null;

    try {
      message = JSON.parse(data.toString()) as IncomingMessage<any>;
    } catch (e) {
      sendError(ws, 'Wrong format');
      return;
    }
    try {
      if (typeof endpoints[message.type] !== 'undefined') {
        endpoints[message.type].method(ws, user, message.data);
      } else {
        throw new ValidationError('Invalid event type');
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
