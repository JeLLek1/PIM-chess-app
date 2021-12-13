import React, { useEffect, useState } from "react";
import { Board, ChessPiece, convertBoardData, convertColorStringToColor, convertPosToAddress, PieceColor } from "../models/chess";
import { API } from '@env';

export interface BoardContextModel {
    allRooms: any[],
    board?: Board,
    possibleMoves?: Array<Array<boolean>>,
    myColor?: PieceColor,
    currentColor?: PieceColor,
    selectedPiece?: ChessPiece,
    roomId?: string,

    //====
    userId?: string,
    userName?: string,
    enemyId?: string,
    enemyName?: string,
    isFirst?: boolean,
    endGameVisible?: boolean,
    joinRoom?: (roomId: string) => void;
    startGame?: () => void;
    createRoom?: (name: string) => void;
    //====

    makeMove?: (row: number, col: number, promotion?: string) => void,
    selectPiece?: (piece: ChessPiece) => void,

    ws?: WebSocket
}

export const BoardContext = React.createContext<BoardContextModel>({allRooms: []});

export const BoardProvider = ( {children}: any ) => { 
    const [board, setBoard] = useState<Board>();
    const [possibleMoves, setPossibleMoves] = useState<Array<Array<boolean>>>();
    const [myColor, setMyColor] = useState<PieceColor>();
    const [currentColor, setCurrentColor] = useState<PieceColor>(PieceColor.WHITE);
    const [selectedPiece, setSelectedPiece] = useState<ChessPiece|undefined>(undefined);
    const [roomId, setRoomId] = useState<string>();
    const [ws, setWs] = useState<WebSocket>(new WebSocket(`ws://${API}/`));
    const [socketMsg, setSocketMsg] = useState<any>();
    const [userId, setUserId] = useState<string>("");
    const [enemyId, setEnemyId] = useState<string>("");
    const [userName, setUserName] = useState<string>("");
    const [enemyName, setEnemyName] = useState<string>("");
    const [allRooms, setAllRooms] = useState<any[]>([]);
    const [isFirst, setIsFirst] = useState<boolean>(false);
    const [endGameVisible, setEndGameVisible] = useState<boolean>(false);

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

    //Hook efektu reagujacy na otrzymane wiadomości od websocketu
    useEffect(() => {
        const socket = ws;
        socket.onopen = () => {
            console.log("connected to websocket");
        }

        socket.onmessage = evt => {
            const msg = JSON.parse(evt.data);
            console.log(msg);
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
            if (msg.typ === 'PARTICIPANT_ABANDONED_ROOM') {
                onEnemyLeftMessage(msg);
            }
            if (msg.type === 'GAME_STARTED') {
                onGameStartedMessage(msg);
            }
            if (msg.type === 'BOARD_UPDATED') {
                onBoardUpdated(msg);
            }
            if (msg.type === 'MOVES_LIST') {
                onMoveCheck(msg);
            }
            if (msg.type === 'GAME_ENDED'){
                onGameEnded(msg);
            }
            setSocketMsg(msg);
        }

        
        setWs(socket);
        return socket.onclose = () => {
            console.log("connection to websocket lost");
        }
    },[])

    //Poniższe funkcje odpowiadają za łączenie się pokojem i rozpoczynanie gry

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
            setUserName(message.data.userName);
        }
    }

    const onJoinedRoomMessage = (message: any) => {
        if (message.data.roomId) {
            setRoomId(message.data.roomId);
        }
        if (message.data.user1) {
            setIsFirst(false);
            setEnemyId(message.data.user1.userId);
        }
    }

    const onRoomCreatedMessage = (message: any) => {
        if (message.data.roomId) {
            setRoomId(message.data.roomId);
            setIsFirst(true);
        }
    }

    const onEnemyJoinedMessage = (message: any) => {
        if (message.data.user2.userId) {
            setEnemyId(message.data.user2.userId);
            setEnemyName(message.data.user2.userName);
        }
    }

    const onEnemyLeftMessage = (message: any) => {
        console.log(message);
        if (message.data.roomId) {
            setRoomId(message.data.roomId);
        }
        setEnemyId("");
        setEnemyName("");
        if (message.data.user1 === userId) {
            setIsFirst(true);
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

    const  onGameEnded = (message: any) => {
        setEndGameVisible(true);
    }
    const joinRoom = (roomId: string) => {
        console.log(`joining room ${roomId}`);
        ws.send(JSON.stringify({
            type: 'JOIN_ROOM',
            data: {
                roomId: roomId
            }
        }))
    }

    const createRoom = (roomName: string) => {
        console.log(ws)
        ws.send(JSON.stringify({
            type: 'CREATE_ROOM',
            data: {
                roomName: roomName
            }
        }))
    }

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

    const onMoveCheck = (msg: any) => {
        setPossibleMoves(msg.data.movesBoard);
    } 

    //wybór figury
    const selectPiece = (piece: ChessPiece) => {
        if (currentColor === myColor && piece) {
            if (selectedPiece === piece || piece.color !== myColor) {
                setSelectedPiece(undefined);
                return;
            }
            ws.send(JSON.stringify({
                type: 'CHECK_FOR_MOVE',
                data: {
                    roomId: roomId,
                    from: convertPosToAddress(piece.position.row, piece.position.col),
                }
            }))
            setSelectedPiece(piece);
        }
    }
    
    //poruszanie figurą
    const makeMove = (row: number, col: number, promotion?: string) => {
        if (selectedPiece) {
            ws.send(JSON.stringify({
                type: 'MAKE_MOVE',
                data: {
                    roomId: roomId,
                    from: convertPosToAddress(selectedPiece.position.row, selectedPiece.position.col),
                    to: convertPosToAddress(row,col),
                    promotion: promotion? promotion : undefined
                }
            }))
            setSelectedPiece(undefined);
            setPossibleMoves(undefined);
        }
    }


    
    const value = {
        allRooms: allRooms,
        board: board,
        possibleMoves: possibleMoves,
        myColor: myColor,
        currentColor: currentColor,
        selectedPiece: selectedPiece,
        roomId: roomId,
        userId: userId,
        enemyId: enemyId,
        userName: userName,
        enemyName: enemyName,
        isFirst: isFirst,
        endGameVisible: endGameVisible,
        joinRoom: joinRoom,
        createRoom: createRoom,
        startGame: startGameMessage,
        makeMove,
        selectPiece,
        ws: ws,
    }

    return (
        <BoardContext.Provider value={value}>
            {children}
        </BoardContext.Provider>
    )
}