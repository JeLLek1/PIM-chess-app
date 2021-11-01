import {
  Board,
  BoardData,
  BoardElement,
  PieceType,
  positionToIndex,
} from '../repositories/additionalTypes/Board';


export function createDefaultPosition(): BoardData{
    const boardData: BoardData = {
      board: Array(8)
        .fill(null)
        .map(() => Array(8).fill(null)),
      result: '*',
      turn: 'w',
    };
    function generatePawns(color: 'w' | 'b'): BoardElement[] {
      const arr = Array(8).fill(null);
      return arr.map(() => {
        return {
          color: color,
          type: 'pawn',
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
        };
      });
    }

    boardData.board[0] = generateOuterRows('w');
    boardData.board[7] = generateOuterRows('b');

    return boardData;
}

export function checkMove(board: BoardData, from: [number, number], to: [number, number]): boolean{
    const piece: BoardElement = board.board[from[0]][from[1]];
    if(piece === null || piece.color !== board.turn) return false;
    return true;
}
