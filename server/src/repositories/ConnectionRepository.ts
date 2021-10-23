import WebSocket from "ws";

const connections = new Map<string, WebSocket>();

export function saveConnection(userId: string, connection: WebSocket){
  const existingConnection = connections.get(userId);
  if(!existingConnection) {
    connections.set(userId, connection);
  }
}

export function getConnectionById(userId: string): WebSocket | null {
  const existingConnection = connections.get(userId);
  return existingConnection ? existingConnection : null;
}

export function deleteConnection(userId: string): void {
  connections.delete(userId);
}

export default {
  saveConnection: saveConnection,
  getConnectionById:getConnectionById,
  deleteConnection: deleteConnection,
}