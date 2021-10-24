import React from "react";
import { View, Text, StyleSheet, Touchable } from 'react-native';

const Room = (prop: {text: string}) => {
    return (
        <View style={styles.room}>
            <Text style={styles.roomText}>{prop.text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    room:{
        backgroundColor: "#FFF",
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },
    roomText:{
        maxWidth: '80%',
    }
})

export default Room;