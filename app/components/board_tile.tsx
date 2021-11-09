import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { BoardContext } from "../contexts/board_context";
import { ChessPiece, PieceColor, PieceType } from "../models/chess";
import BishopBlack from "./icons/bishop_black";
import BishopWhite from "./icons/bishop_white";
import KingBlack from "./icons/king_black";
import KingWhite from "./icons/king_white";
import KnightBlack from "./icons/knight_black";
import KnightWhite from "./icons/knight_white";
import PawnBlack from "./icons/pawn_black";
import PawnWhite from "./icons/pawn_white";
import QueenBlack from "./icons/queen_black";
import QueenWhite from "./icons/queen_white";
import RookBlack from "./icons/rook_black";
import RookWhite from "./icons/rook_white";

const BLACK = "#769656"
const WHITE = "#eeeed2"

export default function BoardTile(props: BoardTileProps) {
    const boardContext = useContext(BoardContext);
    const [piece, setPiece] = useState<ChessPiece|undefined>();

    useEffect(() => {
        setPiece(boardContext.board[props.row][props.col]);
    })

    const backgroundColor = (props.row + props.col) % 2 === 0? WHITE : BLACK;

    const onTileClicked = () => {
        console.log(`Tile: ${props.row}-${props.col}`)
        if (boardContext.selectedPiece && (piece === undefined || piece.color !== boardContext.myColor)) {
            console.log(boardContext.selectedPiece);
            boardContext.makeMove(props.row, props.col);
        } else {
            boardContext.selectPiece(piece);
        }
    }

    const getPieceIcon = (type: PieceType, color: PieceColor) => {
        switch (type) {
            case PieceType.KING: {
                return color === PieceColor.WHITE? <KingWhite /> : <KingBlack />
            }
            case PieceType.QUEEN: {
                return color === PieceColor.WHITE? <QueenWhite /> : <QueenBlack />
            }
            case PieceType.BISHOP: {
                return color === PieceColor.WHITE? <BishopWhite /> : <BishopBlack />
            }
            case PieceType.KNIGHT: {
                return color === PieceColor.WHITE? <KnightWhite /> : <KnightBlack />
            }
            case PieceType.ROOK: {
                return color === PieceColor.WHITE? <RookWhite /> : <RookBlack />
            }
            case PieceType.PAWN: {
                return color === PieceColor.WHITE? <PawnWhite /> : <PawnBlack />
            }
        }
    }


    return (
        <TouchableOpacity onPress={onTileClicked} style={[style.item, {backgroundColor: backgroundColor}]}>
            <View style={[style.item, boardContext.selectedPiece === piece && piece? style.itemSelected : null]}>
                {piece && getPieceIcon(piece.type, piece.color)}
            </View>
        </TouchableOpacity>
    )
}

const style = StyleSheet.create({
    item: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    itemSelected: {
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(247,247,105,0.5)",
    }
})