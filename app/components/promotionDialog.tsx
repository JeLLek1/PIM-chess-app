import React from "react";
import { View, Text, Modal, StyleSheet, Pressable } from "react-native";

interface DialogProps {
    visible: boolean;
    title: string;
    onPromotion: (value: string) => void;
}

export const PromotionDialog = (props: DialogProps) => {
    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={props.visible}
            >
                <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>{props.title}</Text>
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => props.onPromotion("rook")}
                        >
                    <Text style={styles.textStyle}>Rook</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => props.onPromotion("knight")}
                        >
                    <Text style={styles.textStyle}>Knight</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => props.onPromotion("bishop")}
                        >
                    <Text style={styles.textStyle}>Bishop</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => props.onPromotion("queen")}
                        >
                    <Text style={styles.textStyle}>Queen</Text>
                    </Pressable>
                </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
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
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    buttonClose: {
      backgroundColor: "#769656",
      margin: 5
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    }
  });