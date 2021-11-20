export enum PieceType {
    PAWN = "pawn",
    ROOK = "rook",
    KNIGHT = "knight",
    BISHOP = "bishop",
    QUEEN = "queen",
    KING = "king",
}

export enum PieceColor {
    WHITE = "w",
    BLACK = "b"
}

export interface PiecePosition {
    col: number,
    row: number
}

export interface ChessPiece {
    color: PieceColor,
    type: PieceType,
    position: PiecePosition
}


//konwersja PiecePosition na adres pola
export const convertPosToAddress = (row: number, col: number) => {
    const asciiCode = col + 97;
    const ascii = String.fromCharCode(asciiCode);
    console.log(`${ascii}${row+1}`)
    return `${ascii}${row+1}`;
}

//konwersja kodu koloru na enum
export const convertColorStringToColor = (colorS: string) => {
    if (colorS === "w" || colorS === "W") return PieceColor.WHITE;
    if (colorS === "b" || colorS === "B") return PieceColor.BLACK;
    return undefined;
}

//konwersja z board otrzymanego po socket'cie na board wykorzystywany w UI
export const convertBoardData = (boardData: any) => {
    const newBoard = new Array(8);
    for(let i = 0; i < 8; i++) {
        newBoard[i] = new Array(8);
        for (let j = 0; j < 8; j++) {
            if (boardData[i][j]) {
                newBoard[i][j] = {
                    color: boardData[i][j].color,
                    type: boardData[i][j].type,
                    position: {
                        row: i,
                        col: j
                    }
                }
            } else {
                newBoard[i][j] = undefined;
            }
        }
    }
    return newBoard;
}

export type Board = (ChessPiece|undefined)[][];