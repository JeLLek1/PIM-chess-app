import { StatusBar } from "expo-status-bar";
import React, { useContext } from "react";
import {useState} from 'react';
import { StyleSheet, Text, TextInput, Modal, View, Button } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import KingBlack from "../components/icons/king_black";

import Room from "../components/room";
import { BoardContext } from "../contexts/board_context";

const BACKGROUND = "rgb(36,32,30)"
interface IProps{

}

interface RoomType {
  name: string,
  id: string
}

export default function RoomScreen(props: any) {
  
  const [isVisible, setIfVisible] = useState(false)
  const [roomList, setRoomList] = useState<RoomType[]>([])
  const [room, setRoom] = useState({name: '', id: ''})
  const [nick, setNick] = useState()

  const boardContext = useContext(BoardContext);

  return (
    <View style={styles.container}>
      <View style={styles.roomBackground}>
        <Text style={styles.sectionTitle}>Lista pokoi:</Text>
        <View style={styles.roomList}>
          {boardContext.allRooms.map((sRoom: any) =>(
            <Room key={sRoom.roomId} name={sRoom.roomName} id={sRoom.roomId} navigation={props.navigation}></Room>
          ))}
        </View>
      </View>
      <AddRoomModal/>
      <View style={styles.addButton}>
      <Button
        title="Utwórz Pokój"
        onPress={() => setIfVisible(true)}
      />
    </View>
  </View>
  );
  function AddRoomModal(){
    return(
      <View style={styles.modal}>
        <Modal visible={isVisible}>
          <View style={styles.container}>
            <TextInput value={room.name} style={styles.input} placeholder="Nazwa pokoju" onChangeText={e => setRoom({name: e, id: ''})}/>
            <TextInput value={nick} style={styles.input} placeholder="Nick"/>
            <View style={styles.complete}>
            <Button
              title="Zatwierdź"
               onPress={() => addRoom()}
              />
            </View>
          </View>
        </Modal>
      </View>
    )
  }
  function addRoom(){
    if (room.name && boardContext) {
      boardContext.createRoom!(room.name);
    }
    setRoom({name: '', id: ''})
    console.log(nick)
    setIfVisible(false)
    props.navigation.navigate("BoardScreen")
  }

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  modal: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    width: '40%',
    height: '40%',
  },
  input: {
    position: 'relative',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: '50%',
  },
  roomBackground: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  roomList: {},
  buttonText: {
    maxWidth: '80%',
  },
  complete: {
    position: 'relative',
    alignItems: 'center',
    width: '30%',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    paddingHorizontal: 20,
    width: '100%',
    //flexDirection: 'row',
    justifyContent: 'space-between',
    //alignItems: 'center'
  },
});