import { ValidationError } from '../../utils';

export type Board = BoardElement[][];

export type Color = 'w' | 'b';

export type PieceType =
  | 'pawn'
  | 'knight'
  | 'bishop'
  | 'rook'
  | 'queen'
  | 'king';

export type Result = '1-0' | '0-1' | '1/2-1/2' | '*';

export type BoardData = {
  board: Board;
  result: Result;
  turnColor: Color;
  turn: number;
  halfMoves: number; // moves without pawn or capture
};

export type BoardElement = {
  color: Color;
  type: PieceType;
  lastMove: number;
  specialMove: boolean;
};

export type TPieceData = {
  piece: BoardElement;
  position: [number, number];
};

export type TPiecesData = {
  w: TPieceData[];
  b: TPieceData[];
  wking: TPieceData;
  bking: TPieceData;
};

export function positionToIndex(pos: string): [number, number] {
  pos = pos.toLowerCase();
  if (pos.length !== 2) {
    throw new ValidationError('Invalid position format (' + pos + ')');
  }
  const letterPos = pos[0].charCodeAt(0) - 'a'.charCodeAt(0);
  if (isNaN(letterPos) || letterPos < 0 || letterPos > 8)
    throw new ValidationError('Invalid position format (' + pos + ')');
  const numPos = parseInt(pos[1]) - 1;
  if (isNaN(numPos) || numPos < 0 || numPos > 8)
    throw new ValidationError('Invalid position format (' + pos + ')');
  return [numPos, letterPos];
}

export function getPiecesData(board: Board): TPiecesData {
  const out: TPiecesData = {
    w: [],
    b: [],
    wking: null,
    bking: null,
  };

  board.forEach((row, y) => {
    row.forEach((piece, x) => {
      if (piece === null) return;
      const pieceData: TPieceData = {
        piece,
        position: [y, x],
      };
      if (piece.color === 'w') {
        out.w.push(pieceData);
        if (piece.type === 'king') {
          out.wking = pieceData;
        }
      } else {
        out.b.push(pieceData);
        if (piece.type === 'king') {
          out.bking = pieceData;
        }
      }
    });
  });

  return out;
}

export function copyBoard(board: Board) {
  return board.map(row => {
    return row.map(el => {
      if (el === null) {
        return null;
      } else {
        return { ...el };
      }
    });
  });
}

export function copyBoardData(boardData: BoardData) {
  const newBoardData = { ...boardData };
  newBoardData.board = copyBoard(boardData.board);
  return newBoardData;
}

export function getOpositeColor(color: Color): Color {
  if (color === 'w') return 'b';
  return 'w';
}

export function indexToPosition(index: [number, number]): string {
  return index[0] + 1 + String.fromCharCode('A'.charCodeAt(0) + index[1]);
}
