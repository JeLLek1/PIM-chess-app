import React, { useState } from "react";
import { Board, ChessPiece, DEFAULT_BOARD, PieceColor } from "../models/chess";

export interface BoardContextModel {
    board: Board,
    myColor?: PieceColor,
    currentColor: PieceColor,
    selectedPiece?: ChessPiece,

    makeMove?: any,
    selectPiece?: any
}

export const BoardContext = React.createContext<BoardContextModel>({
    board: DEFAULT_BOARD,
    currentColor: PieceColor.WHITE
});

export const BoardProvider = ( {children}: any ) => {
    const [board, setBoard] = useState<Board>(DEFAULT_BOARD);
    const [myColor, setMyColor] = useState<PieceColor>(PieceColor.WHITE);
    const [currentColor, setCurrentColor] = useState<PieceColor>(PieceColor.WHITE);
    const [selectedPiece, setSelectedPiece] = useState<ChessPiece|undefined>(undefined);

    
    const selectPiece = (piece: ChessPiece) => {
        if (currentColor === myColor && piece) {
            if (selectedPiece === piece || piece.color !== myColor) {
                setSelectedPiece(undefined);
                return;
            }
            setSelectedPiece(piece);
        }
    }
    
    const makeMove = (row: number, col: number) => {
        if (selectedPiece) {
            const newBoard = [...board];
            newBoard[selectedPiece.position.row][selectedPiece.position.col] = undefined;
            newBoard[row][col] = selectedPiece;
            newBoard[row][col]!.position = {
                row: row,
                col: col
            } 
            
            setSelectedPiece(undefined);
            setBoard(newBoard);
        }
    }
    
    const value = {
        board: board,
        myColor: myColor,
        currentColor: currentColor,
        selectedPiece: selectedPiece,
        makeMove,
        selectPiece
    }

    return (
        <BoardContext.Provider value={value}>
            {children}
        </BoardContext.Provider>
    )
}