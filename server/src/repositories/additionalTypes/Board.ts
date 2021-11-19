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
};

export type BoardElement = {
  color: Color;
  type: PieceType;
  lastMove: number;
};

export type TPieceData = {
  piece: BoardElement;
  position: [number, number];
};

export type TPiecesData = {
  white: TPieceData[];
  black: TPieceData[];
  whiteKing: TPieceData;
  blackKing: TPieceData;
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

export function getPiecesData(boardData: BoardData): TPiecesData {
  const out: TPiecesData = {
    white: [],
    black: [],
    whiteKing: null,
    blackKing: null,
  };

  boardData.board.forEach((row, y) => {
    row.forEach((piece, x) => {
      if (piece === null) return;
      const pieceData: TPieceData = {
        piece,
        position: [y, x],
      };
      if (piece.color === 'w') {
        out.white.push(pieceData);
        if (piece.type === 'king') {
          out.whiteKing = pieceData;
        }
      } else {
        out.black.push(pieceData);
        if (piece.type === 'king') {
          out.blackKing = pieceData;
        }
      }
    });
  });

  return out;
}

export function getOpositeColor(color: Color): Color {
  if (color === 'w') return 'b';
  return 'w';
}

export function indexToPosition(index: [number, number]): string {
  return index[0] + 1 + String.fromCharCode('A'.charCodeAt(0) + index[1]);
}

