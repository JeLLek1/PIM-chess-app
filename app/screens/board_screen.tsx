import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Button } from "react-native";
import BoardRow from "../components/board_row";
import { BoardContext } from "../contexts/board_context";

const { width } = Dimensions.get("window");
const BLACK = "#769656";
const WHITE = "#eeeed2";

export default function BoardScreen(props: any) {
    const boardContext = useContext(BoardContext);
    
    return (
        <View style={style.container}>
            <View style={style.userBox}>
                <View style={style.textBox}>
                    <Text style={{fontSize: 9}}>User id: {boardContext.userId}</Text>
                    <Text>{boardContext.userName? boardContext.userName : "YOU"}</Text>
                </View>
                {boardContext.myColor && <View style={[style.colorBox, boardContext.myColor === "w"? {backgroundColor: "#fff"}:{ backgroundColor: "#000"}]}>
                </View>}
            </View>
            {boardContext.enemyId !== "" && <View style={style.userBox}>
                <View style={style.textBox}>
                    <Text style={{fontSize: 9}}>User id: {boardContext.enemyId}</Text>
                    <Text>{boardContext.enemyName? boardContext.enemyName : "ENEMY"}</Text>
                </View>
                {boardContext.myColor && <View style={[style.colorBox, boardContext.myColor === "w"? {backgroundColor: "#000"}:{ backgroundColor: "#fff"}]}>
                </View>}
            </View>}
            {(!boardContext.board && boardContext.isFirst) && 
            <Button onPress={boardContext.startGame!} title={"START GAME"}></Button>}
            {boardContext.board && <View style={style.board}>
                {
                    new Array(8).fill(0).map((_,row) => (
                        <BoardRow key={7 - row} row={7 -row}></BoardRow>
                    ))
                }
            </View>}
            {boardContext.board && <View style={style.moveBox}>
                <View style={style.textBox}>
                    <Text>Current move: </Text>
                </View>
                {boardContext.currentColor && <View style={[style.colorBox, boardContext.currentColor === "w"? {backgroundColor: "#fff"}:{ backgroundColor: "#000"}]}>
                </View>}
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
    },

    userBox: {
        margin: 5,
        width: width * 0.9,
        borderColor: BLACK,
        backgroundColor: WHITE,
        borderWidth: 2,
        borderRadius: 5,
        flexDirection: "row",
        justifyContent: "space-between",
    },

    moveBox: {
        margin: 5,
        width: width * 0.5,
        borderColor: BLACK,
        backgroundColor: WHITE,
        borderWidth: 2,
        borderRadius: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    textBox: {
        margin: 5,
    },

    colorBox: {
        width: 40,
        height: 40,
        margin: 5,
        borderWidth: 2,
        borderColor: "#000",
        borderRadius: 5
    }
})