import { getAllConnections } from '../repositories/ConnectionRepository';
import {
  OutgoingEventType,
  createOutgoingMessage,
} from '../endpoints/Messages';

const broadcastMessage = <T>(eventType: OutgoingEventType, data: T): void => {
  getAllConnections().forEach(ws => {
    ws.send(createOutgoingMessage(eventType, data));
  });
};

export default broadcastMessage;
