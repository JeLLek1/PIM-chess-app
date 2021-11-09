import { off } from 'process';
import {
  Board,
  BoardData,
  BoardElement,
  PieceType,
  getOpositeColor,
  getPiecesData,
} from '../repositories/additionalTypes/Board';

const posiblePromotions: PieceType[] = ['knight', 'bishop', 'rook', 'queen'];

// prettier-ignore
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
// prettier-ignore
const pieceMoves: number[][] = [
  [20,  0,  0,  0,  0,  0,  0, 24,  0,  0,  0,  0,  0,  0, 20],
  [ 0, 20,  0,  0,  0,  0,  0, 24,  0,  0,  0,  0,  0, 20,  0],
  [ 0,  0, 20,  0,  0,  0,  0, 24,  0,  0,  0,  0, 20,  0,  0],
  [ 0,  0,  0, 20,  0,  0,  0, 24,  0,  0,  0, 20,  0,  0,  0],
  [ 0,  0,  0,  0, 20,  0,  0, 24,  0,  0, 20,  0,  0,  0,  0],
  [ 0,  0,  0,  0,  0, 20,  2, 25,  2, 20,  0,  0,  0,  0,  0],
  [ 0,  0,  0,  0,  0,  2, 53, 57, 53,  2,  0,  0,  0,  0,  0],
  [24, 24, 24, 24, 24, 56, 56,  0, 56, 56, 24, 24, 24, 24, 24],
  [ 0,  0,  0,  0,  0,  2, 52, 56, 52,  2,  0,  0,  0,  0,  0],
  [ 0,  0,  0,  0,  0, 20,  2, 24,  2, 20,  0,  0,  0,  0,  0],
  [ 0,  0,  0,  0, 20,  0,  0, 24,  0,  0, 20,  0,  0,  0,  0],
  [ 0,  0,  0, 20,  0,  0,  0, 24,  0,  0,  0, 20,  0,  0,  0],
  [ 0,  0, 20,  0,  0,  0,  0, 24,  0,  0,  0,  0, 20,  0,  0],
  [ 0, 20,  0,  0,  0,  0,  0, 24,  0,  0,  0,  0,  0, 20,  0],
  [20,  0,  0,  0,  0,  0,  0, 24,  0,  0,  0,  0,  0,  0, 20],
];
const checkCenter = [7, 7];
const checkDimensions = [15, 15];

const pieceMask = new Map<PieceType, number>([
  ['pawn', 1],
  ['knight', 2],
  ['bishop', 4],
  ['rook', 8],
  ['queen', 16],
  ['king', 32],
]);

/**
 * prepare default board position
 *
 * @returns BoardData
 */
export function createDefaultPosition(): BoardData {
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

/**
 * check if given move for given boar is valis
 *
 * @param boardData BoardData
 * @param from [number, number]
 * @param to [number, number]
 * @param promotion PieceType
 * @returns boolean
 */
export function makeMove(
  boardData: BoardData,
  from: [number, number],
  to: [number, number],
  promotion?: PieceType,
): boolean {
  const piece: BoardElement = boardData.board[from[0]][from[1]];
  // if start position has piece of current color
  if (piece === null || piece.color !== boardData.turnColor) return false;
  const patternPosition = getMovePatternPosition(from, to, piece.color);
  // piece can't be moved on piece of current color or on king squere
  if (
    boardData.board[to[0]][to[1]] !== null &&
    (boardData.board[to[0]][to[1]].color === boardData.turnColor ||
      boardData.board[to[0]][to[1]].type === 'king')
  )
    return false;
  // first check if piece of can make given move pattern
  if (boardData.board[to[0]][to[1]] === null) {
    if (!checkPieceMovePatern(piece, patternPosition)) return false;
    // TODO: check for En passant
  } else {
    if (!checkPieceAttackPatern(piece, patternPosition)) return false;
  }
  // check promotion data
  if (!checkPromotion(piece, to, promotion)) return false;

  const piecesData = getPiecesData(boardData);

  // make move
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

/**
 * check if given move pattern is valid
 *
 * @param piece BoardElement
 * @param patternPosition [number, number]
 * @returns boolean
 */
function checkPieceMovePatern(
  piece: BoardElement,
  patternPosition: [number, number],
): boolean {
  if (
    (pieceMoves[patternPosition[0]][patternPosition[1]] &
      pieceMask.get(piece.type)) ===
    0
  ) {
    return false;
  }
  // check if pawn can make 2 position move
  if (
    piece.type === 'pawn' &&
    checkCenter[0] - patternPosition[0] === 2 &&
    piece.lastMove !== -1
  ) {
    return false;
  }
  return true;
}

/**
 * check if given attack pattern is valid
 *
 * @param piece BoardElement
 * @param patternPosition [number, number]
 * @returns boolean
 */
function checkPieceAttackPatern(
  piece: BoardElement,
  patternPosition: [number, number],
): boolean {
  if (
    (pieceAttacks[patternPosition[0]][patternPosition[1]] &
      pieceMask.get(piece.type)) ===
    0
  ) {
    return false;
  }
  return true;
}

/**
 * return move pattern position
 *
 * @param from [number, number]
 * @param to [number, number]
 * @returns [number, number]
 */
function getMovePatternPosition(
  from: [number, number],
  to: [number, number],
  color: 'w' | 'b',
): [number, number] {
  return color === 'w'
    ? [-(to[0] - from[0]) + checkCenter[0], -(to[1] - from[1]) + checkCenter[1]]
    : [
        checkDimensions[0] - (-(to[0] - from[0]) + checkCenter[0]) - 1,
        checkDimensions[1] - (-(to[1] - from[1]) + checkCenter[1]) - 1,
      ];
}
/**
 * check if promotion data is valid
 *
 * @param piece BoardElement
 * @param from [number, number]
 * @param to [number, number]
 * @param promotion PieceType
 *
 * @returns boolean
 */
function checkPromotion(
  piece: BoardElement,
  to: [number, number],
  promotion?: PieceType,
): boolean {
  if (piece.type !== 'pawn') {
    if (typeof promotion !== 'undefined') return false;
    return true;
  }
  if (
    (piece.color === 'w' && to[0] === 7) ||
    (piece.color === 'b' && to[0] === 0)
  ) {
    if (typeof promotion === 'undefined') return false;
    return true;
  } else {
    if (typeof promotion !== 'undefined') return false;
    return true;
  }
}

function isEnPassant() {
  return false;
}
