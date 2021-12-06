import React, {useState} from "react";
import { View, Text, StyleSheet, Button, Modal} from 'react-native';

function EndGame(){
  const [isVisible, setIsVisible] = useState(false)

    return(
      <View style={styles.modal}>
        <Modal visible={isVisible}>
          <View>
          <Text style={styles.roomText}>Gra Zakończona!</Text>
            <View style={styles.complete}>
            <Button
              title="Powrót do menu głównego"
               onPress={() => returnRoom()}
              />
            </View>
          </View>
        </Modal>
      </View>
    )

    function returnRoom(){

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
export default EndGame()