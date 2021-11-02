import {
  Board,
  BoardData,
  BoardElement,
  PieceType,
  getOpositeColor,
  getPiecesData,
} from '../repositories/additionalTypes/Board';

const posiblePromotions: PieceType[] = ['knight', 'bishop', 'rook', 'queen'];

const pieceAttacks: number[][] = [
  [20,  0,  0,  0,  0,  0,  0, 24,  0,  0,  0,  0,  0,  0, 20],
  [ 0, 20,  0,  0,  0,  0,  0, 24,  0,  0,  0,  0,  0, 20,  0],
  [ 0,  0, 20,  0,  0,  0,  0, 24,  0,  0,  0,  0, 20,  0,  0],
  [ 0,  0,  0, 20,  0,  0,  0, 24,  0,  0,  0, 20,  0,  0,  0],
  [ 0,  0,  0,  0, 20,  0,  0, 24,  0,  0, 20,  0,  0,  0,  0],
  [ 0,  0,  0,  0,  0, 20,  2, 24,  2, 20,  0,  0,  0,  0,  0],
  [ 0,  0,  0,  0,  0,  2, 53, 56, 53,  2,  0,  0,  0,  0,  0],
  [24, 24, 24, 24, 24, 24, 56,  0, 56, 24, 24, 24, 24, 24, 24],
  [ 0,  0,  0,  0,  0,  2, 52, 56, 52,  2,  0,  0,  0,  0,  0],
  [ 0,  0,  0,  0,  0, 20,  2, 24,  2, 20,  0,  0,  0,  0,  0],
  [ 0,  0,  0,  0, 20,  0,  0, 24,  0,  0, 20,  0,  0,  0,  0],
  [ 0,  0,  0, 20,  0,  0,  0, 24,  0,  0,  0, 20,  0,  0,  0],
  [ 0,  0, 20,  0,  0,  0,  0, 24,  0,  0,  0,  0, 20,  0,  0],
  [ 0, 20,  0,  0,  0,  0,  0, 24,  0,  0,  0,  0,  0, 20,  0],
  [20,  0,  0,  0,  0,  0,  0, 24,  0,  0,  0,  0,  0,  0, 20],
];

const pieceMask = new Map<PieceType, number>([
  ["pawn", 1],
  ["knight", 2],
  ["bishop", 4],
  ["rook", 8],
  ["queen", 16],
  ["king", 32],
]);


export function createDefaultPosition(): BoardData{
    const boardData: BoardData = {
      board: Array(8)
        .fill(null)
        .map(() => Array(8).fill(null)),
      result: '*',
      turnColor: 'w',
      turn: 1,
    };
    function generatePawns(color: 'w' | 'b'): BoardElement[] {
      const arr = Array(8).fill(null);
      return arr.map(() => {
        return {
          color: color,
          type: 'pawn',
          lastMove: -1,
        };
      });
    }

    boardData.board[1] = generatePawns('w');
    boardData.board[6] = generatePawns('b');

    function generateOuterRows(color: 'w' | 'b'): BoardElement[] {
      const arr = Array(8).fill(null);
      return arr.map((el, i) => {
        let type: PieceType = 'pawn';
        if (i === 0 || i === 7) type = 'rook';
        else if (i === 1 || i === 6) type = 'knight';
        else if (i === 2 || i === 5) type = 'bishop';
        else if (i === 3) type = 'queen';
        else type = 'king';

        return {
          color: color,
          type: type,
          lastMove: -1,
        };
      });
    }

    boardData.board[0] = generateOuterRows('w');
    boardData.board[7] = generateOuterRows('b');

    return boardData;
}

export function makeMove(
  boardData: BoardData,
  from: [number, number],
  to: [number, number],
  promotion?: PieceType,
): boolean {
  const piece: BoardElement = boardData.board[from[0]][from[1]];
  if (piece === null || piece.color !== boardData.turnColor) return false;
  const piecesData = getPiecesData(boardData);

  if (typeof promotion !== 'undefined') {
    piece.type = promotion;
  }
  piece.lastMove = boardData.turn;
  boardData.board[from[0]][from[1]] = null;
  boardData.board[to[0]][to[1]] = piece;

  boardData.turnColor = getOpositeColor(boardData.turnColor);
  boardData.turn++;
  return true;
}

function kingHasMove(boardData) {}
