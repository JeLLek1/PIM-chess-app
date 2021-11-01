import { ValidationError } from "../../utils";

export type Board = BoardElement[][];

export type Color = "w" | "b";

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
  turn: Color;
};

export type BoardElement = {
  color: Color;
  type: PieceType;
}

export function positionToIndex(pos: string): [number, number] {
  pos = pos.toLowerCase();
  if (pos.length !== 2){
    throw new ValidationError('Invalid position forma (' + pos + ')');
  }
  const letterPos = pos[0].charCodeAt(0) - 'a'.charCodeAt(0);
  if (isNaN(letterPos) || letterPos < 0 || letterPos > 8)
    throw new ValidationError('Invalid position forma (' + pos + ')');
  const numPos = parseInt(pos[1]) - 1;
  if (isNaN(numPos) || numPos < 0 || numPos > 8)
    throw new ValidationError('Invalid position forma (' + pos + ')');
  return [numPos, letterPos];
}

export function getOpositeColor(color: Color): Color {
  if(color === "w") return "b";
  return 'w';
}

export function indexToPosition(index: [number, number]): string {
  return (index[0] + 1) + String.fromCharCode("A".charCodeAt(0) + index[1]);
}