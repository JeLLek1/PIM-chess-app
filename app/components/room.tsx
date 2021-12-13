import React, {useContext, useState} from "react";
import { View, Text, StyleSheet, Button, Image, Modal, TextInput} from 'react-native';
import { BoardContext } from "../contexts/board_context";
import KnightWhite from "./icons/knight_white";

//import "../assets/room-icon.png";

const Room = (prop: {name: string, id: string, navigation: any, user1: any, user2: any}) => {
    const [ifVisible, setIsVisible] = useState(false)
    const [nick, setNick] = useState()
    const boardContext = useContext(BoardContext);
    return (
      <>
        <View style={styles.room}>
          <View style={styles.roomLeft}>
            <KnightWhite />
            <Text style={styles.roomText}>{prop.name}</Text>
          </View>
          <View style={styles.button}>
            {(prop.user1 === null ||
              prop.user2 === null) && (
                <Button title="Dołącz" onPress={() => setIsVisible(true)} />
              )}
          </View>
        </View>
        <JoinRoomModal />
      </>
    );
    function JoinRoomModal(){
        return(
          <View>
              <Modal visible={ifVisible}
              transparent={true}
              >
                <View style={styles.centeredView}>
                <View style={styles.modal}>
                  <TextInput value={nick} style={styles.input} placeholder="Nick"/>
                  <View style={styles.complete}>
                  <Button
                    title="Dołącz"
                    onPress={() => joinRoom()}
                    />
                  </View>
                </View>
                </View>
              </Modal>
          </View>
        )
      }
    function joinRoom(){
        if (boardContext) {
          boardContext.joinRoom!(prop.id)
        }
        setIsVisible(false)
        prop.navigation.navigate("BoardScreen")
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
        width: '80%',
      },
      complete:{
        position: 'relative',
        alignItems: 'center',
        width:"50%"
      },
      centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
    modal: {
        margin: 10,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 40,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
    roomText:{
        maxWidth: '80%',
    },
    button:{

    }
})

export default Room;