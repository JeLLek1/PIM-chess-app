import React from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";

const BLACK = "#422e2f"
const WHITE = "#fef4e1"

export default function BoardTile(props: BoardTileProps) {
    const backgroundColor = (props.row + props.col) % 2 === 0? WHITE : BLACK;

    const onTileClicked = () => {
        console.log(`Tile: ${props.row}-${props.col}`)
    }

    return (
        <TouchableOpacity onPress={onTileClicked} style={[style.item,{backgroundColor: backgroundColor}]}>
            
        </TouchableOpacity>
    )
}

const style = StyleSheet.create({
    item: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})