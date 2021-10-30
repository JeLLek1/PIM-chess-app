export enum PieceType {
    PAWN = "chess-pawn",
    ROOK = "chess-rook",
    KNIGHT = "chess-knight",
    BISHOP = "chess-bishop",
    QUEEN = "chess-queen",
    KING = "chess-king",
}

export enum PieceColor {
    WHITE = "white",
    BLACK = "black"
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

export type Board = (ChessPiece|undefined)[][];

export const DEFAULT_BOARD: Board = [
    [
        {
            type: PieceType.ROOK,
            color: PieceColor.BLACK,
            position: {
                row: 0,
                col: 0
            }
        },
        {
            type: PieceType.KNIGHT,
            color: PieceColor.BLACK,
            position: {
                row: 0,
                col: 1
            }
        },
        {
            type: PieceType.BISHOP,
            color: PieceColor.BLACK,
            position: {
                row: 0,
                col: 2
            }
        },
        {
            type: PieceType.QUEEN,
            color: PieceColor.BLACK,
            position: {
                row: 0,
                col: 3
            }
        },
        {
            type: PieceType.KING,
            color: PieceColor.BLACK,
            position: {
                row: 0,
                col: 4
            }
        },
        {
            type: PieceType.BISHOP,
            color: PieceColor.BLACK,
            position: {
                row: 0,
                col: 5
            }
        },
        {
            type: PieceType.KNIGHT,
            color: PieceColor.BLACK,
            position: {
                row: 0,
                col: 6
            }
        },
        {
            type: PieceType.ROOK,
            color: PieceColor.BLACK,
            position: {
                row: 0,
                col: 7
            }
        }
    ],
    [
        {
            type: PieceType.PAWN,
            color: PieceColor.BLACK,
            position: {
                row: 1,
                col: 0
            }
        },
        {
            type: PieceType.PAWN,
            color: PieceColor.BLACK,
            position: {
                row: 1,
                col: 1
            }
        },
        {
            type: PieceType.PAWN,
            color: PieceColor.BLACK,
            position: {
                row: 1,
                col: 2
            }
        },
        {
            type: PieceType.PAWN,
            color: PieceColor.BLACK,
            position: {
                row: 1,
                col: 3
            }
        },
        {
            type: PieceType.PAWN,
            color: PieceColor.BLACK,
            position: {
                row: 1,
                col: 4
            }
        },
        {
            type: PieceType.PAWN,
            color: PieceColor.BLACK,
            position: {
                row: 1,
                col: 5
            }
        },
        {
            type: PieceType.PAWN,
            color: PieceColor.BLACK,
            position: {
                row: 1,
                col: 6
            }
        },
        {
            type: PieceType.PAWN,
            color: PieceColor.BLACK,
            position: {
                row: 1,
                col: 7
            }
        }
    ],
    Array(8).fill(undefined),
    Array(8).fill(undefined),
    Array(8).fill(undefined),
    Array(8).fill(undefined),
    [
        {
            type: PieceType.PAWN,
            color: PieceColor.WHITE,
            position: {
                row: 6,
                col: 0
            }
        },
        {
            type: PieceType.PAWN,
            color: PieceColor.WHITE,
            position: {
                row: 6,
                col: 1
            }
        },
        {
            type: PieceType.PAWN,
            color: PieceColor.WHITE,
            position: {
                row: 6,
                col: 2
            }
        },
        {
            type: PieceType.PAWN,
            color: PieceColor.WHITE,
            position: {
                row: 6,
                col: 3
            }
        },
        {
            type: PieceType.PAWN,
            color: PieceColor.WHITE,
            position: {
                row: 6,
                col: 4
            }
        },
        {
            type: PieceType.PAWN,
            color: PieceColor.WHITE,
            position: {
                row: 6,
                col: 5
            }
        },
        {
            type: PieceType.PAWN,
            color: PieceColor.WHITE,
            position: {
                row: 6,
                col: 6
            }
        },
        {
            type: PieceType.PAWN,
            color: PieceColor.WHITE,
            position: {
                row: 6,
                col: 7
            }
        }
    ],
    [
        {
            type: PieceType.ROOK,
            color: PieceColor.WHITE,
            position: {
                row: 7,
                col: 0
            }
        },
        {
            type: PieceType.KNIGHT,
            color: PieceColor.WHITE,
            position: {
                row: 7,
                col: 1
            }
        },
        {
            type: PieceType.BISHOP,
            color: PieceColor.WHITE,
            position: {
                row: 7,
                col: 2
            }
        },
        {
            type: PieceType.QUEEN,
            color: PieceColor.WHITE,
            position: {
                row: 7,
                col: 3
            }
        },
        {
            type: PieceType.KING,
            color: PieceColor.WHITE,
            position: {
                row: 7,
                col: 4
            }
        },
        {
            type: PieceType.BISHOP,
            color: PieceColor.WHITE,
            position: {
                row: 7,
                col: 5
            }
        },
        {
            type: PieceType.KNIGHT,
            color: PieceColor.WHITE,
            position: {
                row: 7,
                col: 6
            }
        },
        {
            type: PieceType.ROOK,
            color: PieceColor.WHITE,
            position: {
                row: 7,
                col: 7
            }
        }
    ]
]
