## Incoming Message

```typescript
{
  "type": IncomingMessageType,
  "data": any
}
```

## Outgoing Message

```typescript
{
  "type": OutgoingMessageType,
  "data": any
}
```

## IncomingEventType

```typescript
'CREATE_ROOM'; // tworzenie pokoju gry (CreateRoomPayload)
'JOIN_ROOM'; // dołączanie do pokoju (JoinRoomPayload)
'LEAVE_ROOM'; // opuszczenie pokoju (LeaveRoomPayload)
'START'; // rozpoczęcie rozgrywki (StartGamePayload)
'MAKE_MOVE'; // rozpoczęcie rozgrywki (PieceMovePayload)
```

## OutgoingEventType

```typescript
'USER_CREATED'; // poprawnie połączenie z serwerem
'ROOM_CREATED'; //  stworzono pokój
'JOINED_ROOM'; // dołączono do pokoju
'ABANDONED_ROOM'; // opuszczono pokój
'PARTICIPANT_JOINED_ROOM'; // przeciwnik dołaczył do pokoju
'PARTICIPANT_ABANDONED_ROOM'; // przeciwnik opuścił pokój
'LIST_ROOMS'; // lista dostępnych pokoi ( broadcast przy każdej zmianie w pokojach)
'ERROR'; // błąd podczas wykonywania operacji
'DISCONNECTED'; // rozłączenie z serwerem
'GAME_STARTED'; // rozpoczęcie gry - informacja o pozycji bierek na planszy, kolorze wykonywanego ruchu, kolorze graczy
'BOARD_UPDATED'; // aktualizacja pozycji - informacja o planszy i wykonanym ruchu - jeżeli wykonano ruch z promocją informacja o typie promocji
'GAME_ENDED'; // gra została zakończona
```

## Outgoing Payloads

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

type StartGamePayload = {
  roomId: string;
};

type PieceMovePayload = {
  roomId: string;
  from: string; // przykładowy format "a1"
  to: string; // przykładowy format "a1"
  promotion?: PieceType; // promocja pionka - parametr opcjonlany 'knight' | 'bishop' | 'rook' | 'queen'
};
```
