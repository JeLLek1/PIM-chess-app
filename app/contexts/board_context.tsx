import React, { useEffect, useState } from "react";
import { Board, ChessPiece, convertBoardData, convertColorStringToColor, convertPosToAddress, PieceColor } from "../models/chess";
import { API } from '@env';

export interface BoardContextModel {
    board?: Board,
    myColor?: PieceColor,
    currentColor?: PieceColor,
    selectedPiece?: ChessPiece,
    roomId?: string,

    //====
    userId?: string,
    enemyId?: string,
    joinRoom?: () => void;
    startGame?: () => void;
    //====

    makeMove?: (row: number, col: number) => void,
    selectPiece?: (piece: ChessPiece) => void
}

export const BoardContext = React.createContext<BoardContextModel>({});

export const BoardProvider = ( {children}: any ) => {
    const [board, setBoard] = useState<Board>();
    const [myColor, setMyColor] = useState<PieceColor>();
    const [currentColor, setCurrentColor] = useState<PieceColor>(PieceColor.WHITE);
    const [selectedPiece, setSelectedPiece] = useState<ChessPiece|undefined>(undefined);

    const [roomId, setRoomId] = useState<string>();

    // ========== BEGIN TEST CODE ========== 
    const [ws, setWs] = useState<WebSocket>(new WebSocket(`ws://${API}/`));
    const [socketMsg, setSocketMsg] = useState<any>();
    // TO DO usunąć/zmienić gdy już będzie odpowiednia obsługa websocketu
    const [userId, setUserId] = useState<string>("example");
    const [enemyId, setEnemyId] = useState<string>("");
    const [allRooms, setAllRooms] = useState<any>();

    //Ze względu na opóźnienia związane z odczytem stanu kolor gracza ustawiamy dopiero po tym jak ustawimy wiadomośc o rozpoczetej grze
    useEffect(() => {
        if (socketMsg) {
            if (socketMsg.type === 'GAME_STARTED') {
                const user1Id = socketMsg.data.user1.userId
                const user2Id = socketMsg.data.user2.userId
                if (user1Id === userId) {
                    const color = convertColorStringToColor(socketMsg.data.user1Color)
                    setMyColor(color);
                } else if (user2Id === userId) {
                    setMyColor(socketMsg.data.user1Color === "w"? convertColorStringToColor("b") : convertColorStringToColor("w"));
                }
            }
        }
    },[socketMsg])

    //Hook efektu reagujacy na otrzymane wiadomości od websocketu. Być może lepiej jest to przenieść to jakieogś oddzielneog kontekstu
    useEffect(() => {
        const socket = ws;
        socket.onopen = () => {
            console.log("connected to websocket");
        }

        socket.onmessage = evt => {
            const msg = JSON.parse(evt.data);
            console.log(msg.type);
            if (msg.type === 'LIST_ROOMS') {
                onListRoomsMessage(msg);
            }
            if (msg.type === 'USER_CREATED') {
                onUserCreatedMessage(msg);
            }
            if (msg.type === 'ROOM_CREATED') {
                onRoomCreatedMessage(msg);
            }
            if (msg.type === 'JOINED_ROOM') {
                onJoinedRoomMessage(msg);
            }
            if (msg.type === 'PARTICIPANT_JOINED_ROOM') {
                onEnemyJoinedMessage(msg);
            }
            if (msg.type === 'GAME_STARTED') {
                onGameStartedMessage(msg);
            }
            if (msg.type === 'BOARD_UPDATED') {
                onBoardUpdated(msg);
            }
            setSocketMsg(msg);
        }

        
        setWs(socket);
        return socket.onclose = () => {
            console.log("connection to websocket lost");
        }
    },[])

    //Poniższe funkcje odpowiadają za łączenie się pokojem i rozpoczynanie gry, powstały jako szybkie obejście braku działającego UI pokoi

    const onListRoomsMessage = (message: any) => {
        if (message.data.length === 0) {
            console.log("No rooms");
            setAllRooms([]);
            return;
        }
        setAllRooms(message.data);
    }

    const onUserCreatedMessage = (message: any) => {
        if (message.data.userId) {
            setUserId(message.data.userId);
        }
    }

    const onJoinedRoomMessage = (message: any) => {
        if (message.data.roomId) {
            setRoomId(message.data.roomId);
        }
        if (message.data.user1) {
            setEnemyId(message.data.user1.userId);
        }
    }

    const onRoomCreatedMessage = (message: any) => {
        if (message.data.roomId) {
            setRoomId(message.data.roomId);
        }
    }

    const onEnemyJoinedMessage = (message: any) => {
        if (message.data.user2.userId) {
            setEnemyId(message.data.user2.userId);
        }
    }

    const startGameMessage = () => {
        ws.send(JSON.stringify({
            type: 'START',
            data: {
                roomId: roomId
            }
        }))
    }

    //Ewidentnie do usunięcia bo to beznndziejny kawałek kodu :V ale póki nie ma UI dla pokoi to nie niech tak zostanie
    const joinFreeRoom = () => {
        if (allRooms.length === 0) {
            createBoard(`My room ${userId}`);
            return;
        } 
        for (let i = 0; i < allRooms.length; i++) {
            console.log(allRooms[i].user1);
            if (!allRooms[i].user1 || !allRooms[i].user2) {
                if (allRooms[i].user1.id === userId) continue;
                joinBoard(allRooms[i].roomId);
                return;
            }
        }
        createBoard(`My room ${userId}`);
    }

    const joinBoard = (roomId: string) => {
        console.log(`joining room ${roomId}`);
        ws.send(JSON.stringify({
            type: 'JOIN_ROOM',
            data: {
                roomId: roomId
            }
        }))
    }

    const createBoard = (roomName: string) => {
        ws.send(JSON.stringify({
            type: 'CREATE_ROOM',
            data: {
                roomName: roomName
            }
        }))
    }

    // ========== END TEST CODE ==========


    //ustawianie mapy początkowej, miedzyczasie wywołuje się hook efektu ustalający kolory graczy
    const onGameStartedMessage = (msg: any) => {
        setBoard(convertBoardData(msg.data.boardData.board));
    }

    //ośdwieżenie mapy po ruchu, ustawienie tury kolejnego gracza
    const onBoardUpdated = (msg: any) => {
        setBoard(convertBoardData(msg.data.room.boardData.board));
        if (msg.data.room.boardData.turnColor) {
            const color = convertColorStringToColor(msg.data.room.boardData.turnColor);
            if (color) {
                setCurrentColor(color);
            }
        }
    }
    
    //wybór figury
    const selectPiece = (piece: ChessPiece) => {
        if (currentColor === myColor && piece) {
            if (selectedPiece === piece || piece.color !== myColor) {
                setSelectedPiece(undefined);
                return;
            }
            setSelectedPiece(piece);
        }
    }
    
    //poruszanie figurą
    const makeMove = (row: number, col: number) => {
        if (selectedPiece) {
            ws.send(JSON.stringify({
                type: 'MAKE_MOVE',
                data: {
                    roomId: roomId,
                    from: convertPosToAddress(selectedPiece.position.row, selectedPiece.position.col),
                    to: convertPosToAddress(row,col)
                }
            }))
            setSelectedPiece(undefined);
        }
    }


    
    const value = {
        board: board,
        myColor: myColor,
        currentColor: currentColor,
        selectedPiece: selectedPiece,
        roomId: roomId,
        userId: userId,
        enemyId: enemyId,
        joinRoom: joinFreeRoom,
        startGame: startGameMessage,
        makeMove,
        selectPiece
    }

    return (
        <BoardContext.Provider value={value}>
            {children}
        </BoardContext.Provider>
    )
}