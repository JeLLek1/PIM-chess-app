import ConnectionRepository from '../repositories/ConnectionRepository';
import {
  OutgoingEventType,
  createOutgoingMessage,
} from '../endpoints/Messages';
import { Room } from '../repositories/RoomRepository';
import RoomService from '../services/RoomService';
import { UserService } from '../services';

const sendToRoommates = <T>(room: Room, eventType: OutgoingEventType, data: T): void => {
    ConnectionRepository.getConnections(
      UserService.getIdsFromUsers(RoomService.getUsersOfRoom(room)),
    ).forEach((ws, i) => {
      ws.send(createOutgoingMessage(eventType, data));
    });;
}

export default sendToRoommates;
