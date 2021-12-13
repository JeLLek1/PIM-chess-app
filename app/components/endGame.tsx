import React, {useState} from "react";
import { View, Text, StyleSheet, Button, Modal} from 'react-native';

interface EndGameProps {
  visible?: boolean;
  navigation: any
}

export const EndGame = (props: EndGameProps) =>{

    return(
      <View>
        <Modal visible={props.visible && props.visible!== undefined}
        transparent={true}
        >
          <View style={styles.centeredView}>
          <View style={styles.modal}>
          <View>
          <Text style={styles.roomText}>Gra Zakończona!</Text>
            <View style={styles.complete}>
            <Button
              title="Powrót do menu głównego"
               onPress={() => returnRoom()}
              />
            </View>
          </View>
        </View>
        </View>
        </Modal>
      </View>
    )

    function returnRoom(){
      props.navigation.navigate("RoomScreen")
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
    endGame:{
        backgroundColor: "#FFF",
        padding: 60,
        borderRadius: 60,
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
        width:"90%",
        bottom: 5,
      },
      centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modal: {
        backgroundColor: "white",
        borderRadius: 5,
        padding: 80,
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
        margin: 40,
        fontSize: 20,
        alignItems: 'center',
        maxWidth: '100%',
    },
    resultText:{
        margin: 40,
        fontSize: 30,
        alignItems: 'center',
        maxWidth: '100%',
    },
    button:{

    }
})