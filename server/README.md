## Incoming Message ##

```json
{
  "type": <IncomingMessageType>,
  "data": <any>
}
```

## Outgoing Message ##

```json
{
  "type": <OutgoingMessageType>,
  "data": <any>
}
```

## IncomingEventType ##
```json
  "CREATE_ROOM" - tworzenie pokoju gry (CreateRoomPayload)
  "JOIN_ROOM" - dołączanie do pokoju (JoinRoomPayload)
  "LEAVE_ROOM" - opuszczenie pokoju (LeaveRoomPayload)
```
## OutgoingEventType ##

```json
"USER_CREATED" - poprawnie połączenie z serwerem
"ROOM_CREATED"  -  stworzono pokój
"JOINED_ROOM" - dołączono do pokoju
"ABANDONED_ROOM" - opuszczono pokój
"PARTICIPANT_JOINED_ROOM" - przeciwnik dołaczył do pokoju
"PARTICIPANT_ABANDONED_ROOM" - przeciwnik opuścił pokój
"LIST_ROOMS" - lista dostępnych pokoi ( broadcast przy każdej zmianie w pokojach)
"ERROR" - błąd podczas wykonywania operacji
"DISCONNECTED" - rozłączenie z serwerem
```

## Outgoing Payloads ##
```typescript
type CreateRoomPayload = {
  roomName: string;
};

type JoinRoomPayload = {
  roomId: string;
};

type LeaveRoomPayload = {
  roomId: string;
};
```