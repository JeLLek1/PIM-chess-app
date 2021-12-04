import {
  Board,
  copyBoard,
  BoardData,
  BoardElement,
  PieceType,
  getOpositeColor,
  getPiecesData,
  TPiecesData,
  Color,
  TPieceData,
  copyBoardData,
} from '../repositories/additionalTypes/Board';
import { createBoard } from '../services/RoomService';

type TShifts = {
  [key: string]: [number, number][];
};

type TCastlingData = {
  isCastling: boolean;
  valid: boolean;
  rookPos?: [number, number];
  castlingVector?: [number, number];
};

type TEnPassantData = {
  isEnPassant: boolean;
  valid: boolean;
  pawnPos?: [number, number];
};

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
// prettier-ignore
const reys: TShifts = {
  'queen': [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [-1, 1], [1, -1]],
  'rook': [[-1, 0], [1, 0], [0, -1], [0, 1]],
  'bishop': [[-1, -1], [1, 1], [-1, 1], [1, -1]],
};
// prettier-ignore
const simpleAttacks: TShifts = {
  'knight': [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]],
  'king': [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [-1, 1], [1, -1]],
  'pawn': [[1, 1], [1, -1]],
}

// prettier-ignore
const additionalMoves: TShifts = {
  'king': [[0, 2], [0, -2]],
  'pawn': [[1, 0], [2, 0]],
}

// priettier-ignore
const kingCastlings: [number, number][] = [
  [0, -2],
  [-2, 0],
];

const pieceMask = new Map<PieceType, number>([
  ['pawn', 1],
  ['knight', 2],
  ['bishop', 4],
  ['rook', 8],
  ['queen', 16],
  ['king', 32],
]);

/**
 * Creates board filled with null
 * @return {Board}
 */
function createEmptyBoard(): Board {
  return Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));
}

/**
 * prepare default board position
 *
 * @returns {BoardData}
 */
export function createDefaultPosition(): BoardData {
  const boardData: BoardData = {
    board: createEmptyBoard(),
    result: '*',
    turnColor: 'w',
    turn: 1,
    halfMoves: 0,
  };
  function generatePawns(color: 'w' | 'b'): BoardElement[] {
    const arr = Array(8).fill(null);
    return arr.map(() => {
      return {
        color: color,
        type: 'pawn',
        lastMove: -1,
        specialMove: false,
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
        lastHalfMove: -1,
        specialMove: false,
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
 * @param {BoardData} boardData
 * @param {[number, number]} from
 * @param {[number, number]} to
 * @param {PieceType} promotion
 * @returns {boolean}
 */
export function makeMove(
  boardData: BoardData,
  from: [number, number],
  to: [number, number],
  promotion?: PieceType,
): boolean {
  const piece: BoardElement = boardData.board[from[0]][from[1]];
  let captureOccured = false;
  // if start position has piece of current color
  if (piece === null || piece.color !== boardData.turnColor) return false;
  // copy of piece for possibility of rollback
  const featurePiece: BoardElement = { ...piece };
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
    if (!checkPieceMovePatern(featurePiece, patternPosition)) return false;
  } else {
    if (!checkPieceAttackPatern(featurePiece, patternPosition)) return false;
    captureOccured = true;
  }
  //check if not blocked by any other piece
  if (!squereInRange(featurePiece, boardData.board, from, to)) return false;

  if (!checkPromotion(featurePiece, to, promotion))
    // check promotion data
    return false;

  const featureBoard = copyBoard(boardData.board);
  featureBoard[from[0]][from[1]] = null;
  featureBoard[to[0]][to[1]] = featurePiece;
  if (typeof promotion !== 'undefined') {
    featurePiece.type = promotion;
  }
  // en passant move
  const enPassantData: TEnPassantData = getEnPassantData(
    piece,
    boardData.board,
    from,
    to,
    boardData.turn++,
  );
  if (enPassantData.isEnPassant) {
    if (!enPassantData.valid) {
      return false;
    }
    featureBoard[enPassantData.pawnPos[0]][enPassantData.pawnPos[1]] = null;
  }

  const faturePiecesData: TPiecesData = getPiecesData(featureBoard);
  // get attacked squares
  const featureAttackedSquares = getAttackedSqares(
    faturePiecesData,
    featureBoard,
    getOpositeColor(boardData.turnColor),
  );
  // check if king can move on given squere
  const futureKingPos = faturePiecesData[`${piece.color}king`].position;
  if (featureAttackedSquares[futureKingPos[0]][futureKingPos[1]]) return false;
  // check if castling is valid
  const castlingData = getCastlingData(
    piece,
    boardData.board,
    featureAttackedSquares,
    from,
    to,
  );
  if (!castlingData.valid) return false;
  if (castlingData.isCastling) {
    const rookFuturePos: [number, number] = [
      to[0] - castlingData.castlingVector[0],
      to[1] - castlingData.castlingVector[1],
    ];
    const rook = featureBoard[castlingData.rookPos[0]][castlingData.rookPos[1]];
    featureBoard[castlingData.rookPos[0]][castlingData.rookPos[1]] = null;
    featureBoard[rookFuturePos[0]][rookFuturePos[1]] = rook;
    rook.lastMove = boardData.turn;
  }

  // make move
  featurePiece.lastMove = boardData.turn;
  boardData.board = featureBoard;
  boardData.turnColor = getOpositeColor(boardData.turnColor);
  boardData.turn++;

  if (piece.type === 'pawn' || captureOccured) {
    boardData.halfMoves = 0;
  } else {
    boardData.halfMoves++;
  }
  return true;
}

export function checkGameResult(boardData: BoardData) {
  const piecesData: TPiecesData = getPiecesData(boardData.board);
  const attackedSquares = getAttackedSqares(
    piecesData,
    boardData.board,
    getOpositeColor(boardData.turnColor),
  );
  let isKingAttacked = false;
  const kingPos = piecesData[`${boardData.turnColor}king`].position;
  if (attackedSquares[kingPos[0]][kingPos[1]]) {
    isKingAttacked = true;
  }
  const hasMoves = () => {
    for (const pieceData in piecesData[`${boardData.turnColor}`]) {
      if (
        getPossibleMovesPos(
          piecesData[`${boardData.turnColor}`][pieceData].piece,
          boardData,
          piecesData[`${boardData.turnColor}`][pieceData].position,
        ).length > 0
      ) {
        return true;
      }
    }
    return false;
  };
  if (!hasMoves()) {
    if (isKingAttacked) {
      if (boardData.turnColor === 'w') {
        boardData.result = '0-1';
      } else {
        boardData.result = '1-0';
      }
    } else {
      boardData.result = '1/2-1/2';
    }
  }
  if (boardData.halfMoves >= 50) {
    boardData.result = '1/2-1/2';
  }
}

/**
 * check if given move pattern is valid
 *
 * @param {BoardElement} piece
 * @param {[number, number]} patternPosition
 * @returns {boolean}
 */
function checkPieceMovePatern(
  piece: BoardElement,
  patternPosition: [number, number],
): boolean {
  piece.specialMove = false;
  if (
    (pieceMoves[patternPosition[0]][patternPosition[1]] &
      pieceMask.get(piece.type)) ===
    0
  ) {
    return false;
  }
  // check if pawn can make 2 position move
  if (piece.type === 'pawn' && checkCenter[0] - patternPosition[0] === 2) {
    if (piece.lastMove === -1) {
      piece.specialMove = true;
    } else {
      return false;
    }
  }
  return true;
}

/**
 * check if given attack pattern is valid
 *
 * @param {BoardElement} piece
 * @param {[number, number]} patternPosition
 * @returns {boolean}
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
 * @param {[number, number]} from
 * @param {[number, number]} to
 * @returns {[number, number]}
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
 * @param {BoardElement} piece
 * @param {[number, number]} from
 * @param {[number, number]} to
 * @param {PieceType} promotion
 *
 * @returns {boolean}
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

/**
 * check if given squere is in range of piece type
 *
 * @param {BoardElement} piece
 * @param {Board} board
 * @param {[number, number]} from
 * @param {[number, number]} squere
 * @returns {boolean}
 */
function squereInRange(
  piece: BoardElement,
  board: Board,
  from: [number, number],
  squere: [number, number],
): boolean {
  if (['pawn', 'king', 'knight'].includes(piece.type)) {
    return true;
  }
  if (
    getPossibleAttackedSquares(board, from).some(pos => {
      if (pos[0] === squere[0] && pos[1] === squere[1]) {
        return true;
      }
      return false;
    })
  ) {
    return true;
  }
  return false;
}

/**
 * get valid moves for given piece
 *
 * @param {BoardElement} piece
 * @param {BoardData} boardData
 * @param {[number, number]} from
 * @returns {[number, number][]}
 */
function getPossibleMovesPos(
  piece: BoardElement,
  boardData: BoardData,
  from: [number, number],
): [number, number][] {
  const possibleMoves = getPossibleAttackedSquares(boardData.board, from);
  if (additionalMoves[piece.type] !== undefined) {
    additionalMoves[piece.type].forEach(shift => {
      let newPos: [number, number] = null;
      if (piece.type == 'pawn' && piece.color == 'b') {
        newPos = [from[0] - shift[0], from[1] - shift[1]];
      } else {
        newPos = [from[0] + shift[0], from[1] + shift[1]];
      }
      if (!isValidPosition(newPos)) return;
      possibleMoves.push(newPos);
    });
  }
  const validMoves = [];
  for (const move of possibleMoves) {
    const tmpBoardData = copyBoardData(boardData);
    let promotion: PieceType = undefined;
    if (
      piece.type === 'pawn' &&
      ((piece.color === 'w' && move[0] === 7) ||
        (piece.color === 'b' && move[0] === 0))
    ) {
      promotion = 'queen';
    }
    if (makeMove(tmpBoardData, from, move, promotion)) {
      validMoves.push(move);
    }
  }
  return validMoves;
}

/**
 * get posible attacked squares by piece in given position
 *
 * @param {Board} board
 * @param {[number, number]} from
 * @returns {[number, number][]}
 */
function getPossibleAttackedSquares(
  board: Board,
  from: [number, number],
): [number, number][] {
  const piece: BoardElement = board[from[0]][from[1]];
  const squaresInRange: [number, number][] = [];
  if (piece === null) return [];
  if (['pawn', 'king', 'knight'].includes(piece.type)) {
    simpleAttacks[piece.type].forEach(shift => {
      let newPos: [number, number] = null;
      if (piece.type == 'pawn' && piece.color == 'b') {
        newPos = [from[0] - shift[0], from[1] - shift[1]];
      } else {
        newPos = [from[0] + shift[0], from[1] + shift[1]];
      }
      if (!isValidPosition(newPos)) return;
      if (
        board[newPos[0]][newPos[1]] !== null &&
        board[newPos[0]][newPos[1]].color === piece.color
      ) {
        return;
      }
      squaresInRange.push(newPos);
    });
  } else {
    reys[piece.type].forEach(shift => {
      let newPos: [number, number] = [...from];
      while (true) {
        newPos = [newPos[0] + shift[0], newPos[1] + shift[1]];
        if (!isValidPosition(newPos)) break;
        const newPosPiece = board[newPos[0]][newPos[1]];
        if (newPosPiece === null) {
          squaresInRange.push(newPos);
          continue;
        } else if (newPosPiece.color === piece.color) {
          break;
        } else {
          squaresInRange.push(newPos);
          break;
        }
      }
    });
  }
  return squaresInRange;
}

/**
 * check castling data for given piece
 *
 * @param {BoardElement} piece
 * @param {Board} board
 * @param {boolean[][]} featureAttackedSquares
 * @param {[number, number]} from
 * @param {[number, number]} to
 * @returns {TCastlingData}
 */
function getCastlingData(
  piece: BoardElement,
  board: Board,
  featureAttackedSquares: boolean[][],
  from: [number, number],
  to: [number, number],
): TCastlingData {
  const castlingData: TCastlingData = {
    isCastling: false,
    valid: true,
    rookPos: null,
    castlingVector: null,
  };
  if (piece.type !== 'king') return castlingData;
  const kingVector: [number, number] = [to[0] - from[0], to[1] - from[1]];
  if (kingVector[0] !== 0 || (kingVector[1] !== -2 && kingVector[1] !== 2))
    return castlingData;
  castlingData.isCastling = true;
  const vLength = Math.sqrt(
    kingVector[0] * kingVector[0] + kingVector[1] * kingVector[1],
  );
  castlingData.castlingVector = [
    kingVector[0] / vLength,
    kingVector[1] / vLength,
  ];
  // first king move
  if (piece.lastMove != -1) {
    castlingData.valid = false;
    return castlingData;
  }
  let rook: BoardElement = null;
  let searchRookPosition: [number, number] = [...from];
  let searchPattern = kingVector[1] < 0 ? [0, -1] : [0, 1];
  // search for rook
  while (
    isValidPosition([
      searchRookPosition[0] + searchPattern[0],
      searchRookPosition[1] + searchPattern[1],
    ]) &&
    rook === null
  ) {
    searchRookPosition = [
      searchRookPosition[0] + searchPattern[0],
      searchRookPosition[1] + searchPattern[1],
    ];
    rook = board[searchRookPosition[0]][searchRookPosition[1]];
    castlingData.rookPos = [...searchRookPosition];
  }
  // check rook rules
  if (rook === null || rook.type !== 'rook' || rook.lastMove != -1) {
    castlingData.valid = false;
    return castlingData;
  }
  // check king rules
  let searchKingPosition = [...from];
  for (let i = 0; i < 3; i++) {
    if (featureAttackedSquares[searchKingPosition[0]][searchKingPosition[1]]) {
      castlingData.valid = false;
      return castlingData;
    }
    searchKingPosition = [
      searchKingPosition[0] + searchPattern[0],
      searchKingPosition[1] + searchPattern[1],
    ];
  }
  return castlingData;
}

/**
 * get en passant data
 *
 * @param {BoardElement} piece
 * @param {Board} board
 * @param {[number, number]} from
 * @param {[number, number]} to
 *
 * @return {TEnPassantData}
 */
function getEnPassantData(
  piece: BoardElement,
  board: Board,
  from: [number, number],
  to: [number, number],
  turn: number,
): TEnPassantData {
  const enPassantData: TEnPassantData = {
    isEnPassant: false,
    valid: true,
    pawnPos: null,
  };
  if (piece.type !== 'pawn') return enPassantData;
  if (board[to[0]][to[1]] !== null) return enPassantData;
  if (from[1] === to[1]) return enPassantData;
  enPassantData.isEnPassant = true;
  enPassantData.pawnPos = [from[0], to[1]];
  const pawn = board[enPassantData.pawnPos[0]][enPassantData.pawnPos[1]];
  if (
    pawn === null ||
    pawn.type !== 'pawn' ||
    !pawn.specialMove ||
    pawn.lastMove !== turn - 1
  ) {
    enPassantData.valid = false;
    return enPassantData;
  }
  return enPassantData;
}

/**
 * check if given position is valid
 *
 * @param {[number, number]} pos
 * @returns {boolean}
 */
function isValidPosition(pos: [number, number]): boolean {
  if (pos[0] < 0 || pos[0] > 7 || pos[1] < 0 || pos[1] > 7) {
    return false;
  }
  return true;
}

/**
 * get attacked squeres pattern
 *
 * @param {TPiecesData} piecesData
 * @param {Board} board
 * @param {Color} color - color of pieces to return
 * @returns {boolean[][]}
 */
function getAttackedSqares(
  piecesData: TPiecesData,
  board: Board,
  color: Color,
): boolean[][] {
  const attackedSquares = Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, () => false),
  );
  piecesData[color].forEach(pieceData => {
    getPossibleAttackedSquares(board, pieceData.position).forEach(pos => {
      attackedSquares[pos[0]][pos[1]] = true;
    });
  });

  return attackedSquares;
}

/**
 * calcualates possible moves for given position and board
 *
 * @param {[number, number]} from
 * @returns {Board}
 */
export function getPossibleMoves(
  boardData: BoardData,
  from: [number, number],
): boolean[][] {
  const board = boardData.board;
  const piece = board[from[0]][from[1]];
  let moveBoard = Array(8)
    .fill(false)
    .map(() => Array(8).fill(false));

  if (piece === null) return moveBoard;

  const posibleMoves = getPossibleMovesPos(piece, boardData, from);
  posibleMoves.forEach(move => {
    moveBoard[move[0]][move[1]] = true;
  });
  return moveBoard;
}
