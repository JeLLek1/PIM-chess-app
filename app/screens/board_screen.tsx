import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Button } from "react-native";
import BoardRow from "../components/board_row";
import { BoardContext } from "../contexts/board_context";

const { width } = Dimensions.get("window");

export default function BoardScreen(props: any) {
    const boardContext = useContext(BoardContext);
    
    return (
        <View style={style.container}>
            <Button onPress={boardContext.startGame!} title={"START GAME"}></Button>
            <Text>User id: {boardContext.userId}</Text>
            <Text>Enemy id: {boardContext.enemyId}</Text>
            <Text>Room id: {boardContext.roomId}</Text>
            <Text>My color: {boardContext.myColor}</Text>
            <Text>Current color: {boardContext.currentColor}</Text>
            {boardContext.board && <View style={style.board}>
                {
                    new Array(8).fill(0).map((_,row) => (
                        <BoardRow key={row} row={row}></BoardRow>
                    ))
                }
            </View>}
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    board: {
        width: width,
        height: width
    }
})