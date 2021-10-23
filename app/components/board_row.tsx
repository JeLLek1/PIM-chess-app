import React from "react";
import { StyleSheet, View } from "react-native";
import BoardTile from "./board_tile";

export default function BoardRow(props: BoardRowProps) {
    return (
        <View style={style.row}>
            {
                new Array(8).fill(0).map((_,col) => (
                    <BoardTile key={col} row={props.row} col={col}></BoardTile>
                ))
            }
        </View>
    )
}

const style = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: "row"
    }
})