import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, Text, View, Dimensions } from "react-native";
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
import { PromotionDialog } from "./promotionDialog";

const BLACK = "#769656"
const WHITE = "#eeeed2"

export default function BoardTile(props: BoardTileProps) {
    const boardContext = useContext(BoardContext);
    const [piece, setPiece] = useState<ChessPiece|undefined>();
    const [possibleMove, setPossibleMove] = useState<boolean>(false);
    const [promotionVisible, setPromotionVisible] = useState<boolean>(false);

    useEffect(() => {
        setPiece(boardContext.board![props.row][props.col]);
        if (boardContext.possibleMoves) {
            setPossibleMove(boardContext.possibleMoves[props.row][props.col]);
        } else {
            setPossibleMove(false);
        }
    })
    
    let backgroundColor;
    if (boardContext.myColor === PieceColor.BLACK) {
        backgroundColor = (props.row + props.col) % 2 === 0? WHITE : BLACK;
    } else {
        backgroundColor = (props.row + props.col) % 2 === 1? WHITE : BLACK;
    }

    const onTileClicked = () => {
        console.log(`Tile: ${props.row}-${props.col}`)
        if (boardContext.selectedPiece && (piece === undefined || piece.color !== boardContext.myColor)) {
            console.log(boardContext.selectedPiece);
            if (boardContext.selectedPiece.type === "pawn") {
                if (boardContext.selectedPiece.color === PieceColor.WHITE && props.row === 7) {
                    setPromotionVisible(true);
                    return;
                }
                if (boardContext.selectedPiece.color === PieceColor.BLACK && props.row === 0) {
                    setPromotionVisible(true);
                    return;
                }
            }
            boardContext.makeMove!(props.row, props.col);
            setPossibleMove(false);
        } else {
            if (piece && boardContext.selectPiece) boardContext.selectPiece(piece);
        }
    }

    const onPromotion = (value: string) => {
        setPromotionVisible(false);
        boardContext.makeMove!(props.row, props.col,value);
        setPossibleMove(false);
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
                {(piece && !possibleMove) && getPieceIcon(piece.type, piece.color)}
                {(possibleMove && !piece) && <View style={style.possibleMove}></View>}
                {(possibleMove && piece) && <View style={[style.possibleMove, style.relative]}>{getPieceIcon(piece.type, piece.color)}</View>}
            </View>
            <PromotionDialog visible={promotionVisible} onPromotion={onPromotion} title="Select promotion"></PromotionDialog>
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
    },

    possibleMove: {
        width: Dimensions.get("window").width/8 * 0.33,
        height: "33%",
        alignSelf:'center',
        borderRadius: 100,
        backgroundColor: "rgba(0, 0, 0, 0.4)"
    },

    relative: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: Dimensions.get("window").width/8,
    }
})