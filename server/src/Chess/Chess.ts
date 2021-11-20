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
} from '../repositories/additionalTypes/Board';
import { createBoard } from '../services/RoomService';

type TShifts = {
  [key: string]: [number, number][];
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
    //if (!checkEnPassant()) return false;
    // TODO: check for En passant
  } else {
    if (!checkPieceAttackPatern(piece, patternPosition)) return false;
    captureOccured = true;
  }
  //check if not blocked by any other piece
  if (!squereInRange(piece, boardData.board, from, to)) return false;

  // check promotion data
  if (!checkPromotion(piece, to, promotion)) return false;

  const featureBoard = copyBoard(boardData.board);
  const featurePiece: BoardElement = featureBoard[from[0]][from[1]];
  featureBoard[from[0]][from[1]] = null;
  featureBoard[to[0]][to[1]] = featurePiece;
  if (typeof promotion !== 'undefined') {
    featurePiece.type = promotion;
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
  // game result
  if (boardData.halfMoves >= 50) {
    boardData.result = '1/2-1/2';
  }
  return true;
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
  // console.log(boardData.board)

  const x = from[0],
    y = from[1];

  function movesDiag(): boolean[][] {
    const moveBoard = Array(8)
      .fill(false)
      .map(() => Array(8).fill(false));
    let stopTR = false,
      stopTL = false,
      stopBR = false,
      stopBL = false;

    for (let i = 1; i < 8; i++) {
      if (!stopTL) {
        if (x - i >= 0 && y + i < 8 && board[x - i][y + i] === null) {
          moveBoard[x - i][y + i] = true;
        } else {
          if (
            x - i >= 0 &&
            y + i < 8 &&
            board[x - i][y + i].color !== piece.color
          ) {
            moveBoard[x - i][y + i] = true;
          }
          stopTL = true;
        }
      }
      if (!stopTR) {
        if (x + i < 8 && y + i < 8 && board[x + i][y + i] === null) {
          moveBoard[x + i][y + i] = true;
        } else {
          if (
            x + i < 8 &&
            y + i < 8 &&
            board[x + i][y + i].color !== piece.color
          ) {
            moveBoard[x + i][y + i] = true;
          }
          stopTR = true;
        }
      }
      if (!stopBL) {
        if (x - i >= 0 && y - i >= 0 && board[x - i][y - i] === null) {
          moveBoard[x - i][y - i] = true;
        } else {
          if (
            x - i >= 0 &&
            y - i >= 0 &&
            board[x - i][y - i].color !== piece.color
          ) {
            moveBoard[x - i][y - i] = true;
          }
          stopBL = true;
        }
      }
      if (!stopBR) {
        if (x + i < 8 && y - i >= 0 && board[x + i][y - i] === null) {
          moveBoard[x + i][y - i] = true;
        } else {
          if (
            x + i < 8 &&
            y - i >= 0 &&
            board[x + i][y - i].color !== piece.color
          ) {
            moveBoard[x + i][y - i] = true;
          }
          stopBR = true;
        }
      }
    }
    return moveBoard;
  }

  function movesStraight(): boolean[][] {
    const moveBoard = Array(8)
      .fill(false)
      .map(() => Array(8).fill(false));
    let stopT = false,
      stopL = false,
      stopR = false,
      stopB = false;

    for (let i = 1; i < 8; i++) {
      if (!stopT) {
        if (y + i < 8 && board[x][y + i] === null) {
          moveBoard[x][y + i] = true;
        } else {
          if (y + i < 8 && board[x][y + i].color !== piece.color) {
            moveBoard[x][y + i] = true;
          }
          stopT = true;
        }
      }
      if (!stopR) {
        if (x + i < 8 && board[x + i][y] === null) {
          moveBoard[x + i][y] = true;
        } else {
          if (x + i < 8 && board[x + i][y].color !== piece.color) {
            moveBoard[x + i][y] = true;
          }
          stopR = true;
        }
      }
      if (!stopB) {
        if (y - i >= 0 && board[x][y - i] === null) {
          moveBoard[x][y - i] = true;
        } else {
          if (y - i >= 0 && board[x][y - i].color !== piece.color) {
            moveBoard[x][y - 1] = true;
          }
          stopB = true;
        }
      }
      if (!stopL) {
        if (x - i >= 0 && board[x - i][y] === null) {
          moveBoard[x - i][y] = true;
        } else {
          if (x - i >= 0 && board[x - i][y].color !== piece.color) {
            moveBoard[x - i][y] = true;
          }
          stopL = true;
        }
      }
    }
    return moveBoard;
  }

  if (piece === null) return moveBoard;
  switch (piece.type) {
    case 'pawn': {
      break;
    }
    case 'knight': {
      for (let i = -2; i <= 2; i++) {
        for (let j = -2; j <= 2; j++) {
          if (x + i >= 0 && x + i <= 7 && y + j >= 0 && y + j <= 7) {
            moveBoard[x + i][y + j] = !!(
              pieceMoves[checkCenter[0] + i][checkCenter[1] + j] &
                pieceMask.get('knight') &&
              (!board[x + i][y + j] ||
                board[x + i][y + j].color !== piece.color)
            );
          }
        }
      }
      break;
    }
    case 'bishop': {
      moveBoard = movesDiag();
      break;
    }
    case 'rook': {
      moveBoard = movesStraight();
      break;
    }
    case 'queen': {
      const tmp1 = movesDiag();
      const tmp2 = movesStraight();
      moveBoard = tmp1.map((e, i) => {
        return e.map((c, j) => {
          return c || tmp2[i][j];
        });
      });
      break;
    }
    case 'king': {
      break;
    }
  }
  return moveBoard;
}
