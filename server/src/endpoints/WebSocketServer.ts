import WebSocket from 'ws';
import parse from 'url-parse';
import UserService from '../services/UserService';
import ConnectionRepository, { saveConnection } from '../repositories/ConnectionRepository';
import { createOutgoingMessage, IncomingEventType, IncomingMessage, OutgoingEventType, OutgoingMessage } from './Messages';
import RoomService from '../services/RoomService';
import { CreateRoomPayload } from './PayloadsTypes';

const wss = new WebSocket.Server({
  noServer: true,
});


wss.on('connection', (ws, request) => {
  const url = parse(request.url);
  const userName = url.pathname.substr(1).split('/')[0];

  const user = UserService.createUser(userName);

  if (user === null) {
    ws.send('created'); //TODO error handling
    ws.close();
  }
  saveConnection(user.userId, ws);
  ws.send(createOutgoingMessage(OutgoingEventType.USER_CREATED, user));
  
  ws.on('close', () => {
    console.log('disconnected'); // TODO send message on close
    ConnectionRepository.deleteConnection(user.userId);
    UserService.removeUser(user.userId);
  });

  ws.on('message', (data) => {
    let message: IncomingMessage | null = null;

    try {
      message = JSON.parse(data.toString()) as IncomingMessage;
    } catch (e) {
      sendError(ws, 'Wrong format');
      return;
    }

    switch(message.type) {
      case IncomingEventType.CREATE_ROOM: {
        const payload = message.data as CreateRoomPayload;
        if (payload && typeof payload.roomName === 'string') {
          const room = RoomService.createRoom(payload.roomName);
          ws.send(createOutgoingMessage(OutgoingEventType.ROOM_CREATED, room));
        } else {
          sendError(ws, 'Wrong format');
          return;
        }
        break;
      }
      default: {
        sendError(ws, 'Invalid event type');
        return;
      }
    }
  });
});

const sendError = (ws, message) => {
  ws.send(createOutgoingMessage(OutgoingEventType.ERROR, message));
};

export default wss;