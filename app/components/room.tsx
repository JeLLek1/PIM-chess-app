import React from "react";
import { View, Text, StyleSheet, Button, Image } from 'react-native';

//import "../assets/room-icon.png";

const Room = (prop: {text: string}) => {
    return (
        <View style={styles.room}>
            <View style={styles.roomLeft}>
                <Image source={require("../assets/room-icon.png")} style={styles.icon}/>
                <Text style={styles.roomText}>{prop.text}</Text>
            </View>
            <View style={styles.button}>
            <Button
                title="Dołącz"
                onPress={() => console.log('Dołączono')}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    icon:{
        width: 60, 
        height: 60
    },
    roomLeft:{
        flexDirection: 'row',
        alignItems: "center",
        flexWrap: 'wrap'
    },
    room:{
        backgroundColor: "#FFF",
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20
    },
    roomText:{
        maxWidth: '80%',
    },
    button:{

    }
})

export default Room;