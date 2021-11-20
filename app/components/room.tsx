import React, {useState} from "react";
import { View, Text, StyleSheet, Button, Image, Modal, TextInput} from 'react-native';

//import "../assets/room-icon.png";

const Room = (prop: {name: string}) => {
    const [ifVisible, setIsVisible] = useState(false)
    const [nick, setNick] = useState()

    return (
        <>
        <View style={styles.room}>
            <View style={styles.roomLeft}>
                <Image source={require("../assets/room-icon.png")} style={styles.icon}/>
                <Text style={styles.roomText}>{prop.name}</Text>
            </View>
            <View style={styles.button}>
            <Button
                title="Dołącz"
                onPress={() => setIsVisible(true)}
                />
            </View>
        </View>
        <JoinRoomModal/>
        </>
    )
    function JoinRoomModal(){
        return(
          <View style={styles.modal}>
            <Modal visible={ifVisible}>
              <View>
                <TextInput value={nick} style={styles.input} placeholder="Nick"/>
                <View style={styles.complete}>
                <Button
                  title="Dołącz"
                   onPress={() => joinRoom()}
                  />
                </View>
              </View>
            </Modal>
          </View>
        )
      }
    function joinRoom(){
        setIsVisible(false)
    }
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
    input:{
        position: "relative",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: '#FFF',
        borderRadius: 60,
        borderColor: "#C0C0C0",
        borderWidth: 1,
        width: '50%',
      },
      complete:{
        position: 'relative',
        alignItems: 'center',
        width:"30%"
      },
    modal:{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: 'relative',
        width:"40%",
        height:"40%"
      },
    roomText:{
        maxWidth: '80%',
    },
    button:{

    }
})

export default Room;