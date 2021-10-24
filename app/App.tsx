import { StatusBar } from "expo-status-bar";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

import RoomScreen from "./screens/room_screen";
import BoardScreen from "./screens/board_screen";

const BACKGROUND = "rgb(36,32,30)"

export default function App() {
  return (
    <View style={styles.container}>
      <RoomScreen></RoomScreen>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED'
    //alignItems: "center",
    //justifyContent: "center",
    //backgroundColor: BACKGROUND
  },
});