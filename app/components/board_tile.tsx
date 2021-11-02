import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { BoardContext } from "../contexts/board_context";
import { ChessPiece, PieceColor, PieceType } from "../models/chess";

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


    return (
        <TouchableOpacity onPress={onTileClicked} style={[style.item, {backgroundColor: backgroundColor}]}>
            <View style={[style.item, boardContext.selectedPiece === piece && piece? style.itemSelected : null]}>
                {piece && <MaterialCommunityIcons name={piece?.type} color={piece.color} size={32}/>}
            </View>
        </TouchableOpacity>
    )
}

const style = StyleSheet.create({
    item: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    itemSelected: {
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(247,247,105,0.5)",
    }
})