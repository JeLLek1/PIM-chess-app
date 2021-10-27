

export type Board = BoardElement[][];

export type BoardData = {
  board: Board;
}

export type PieceType = "pawn" | "knight" | "bishop" | "rook" | "queen" | "king"

export type BoardElement = {
  color: "w" | "b";
  type: PieceType;
}

export function positionToIndex(pos: string): [number, number] {
  pos = pos.toLowerCase();
  const letterPos = pos[0].charCodeAt(0) - "a".charCodeAt(0);
  if (letterPos < 0 || letterPos > 8) 
    throw new Error("Invalid position forma (" + pos + ")");
  const numPos = parseInt(pos[1]) - 1;
  if (numPos < 0 || numPos > 8) 
    throw new Error("Invalid position forma (" + pos + ")");
  return [numPos, letterPos];
}

export function indexToPosition(index: [number, number]): string {
  return (index[0] + 1) + String.fromCharCode("A".charCodeAt(0) + index[1]);
}