import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import BoardRow from "../components/board_row";

const { width } = Dimensions.get("window");

export default function BoardScreen(props: any) {
    return (
        <View style={style.board}>
            {
                new Array(8).fill(0).map((_,row) => (
                    <BoardRow key={row} row={row}></BoardRow>
                ))
            }
        </View>
    )
}

const style = StyleSheet.create({
    board: {
        width: width,
        height: width
    }
})