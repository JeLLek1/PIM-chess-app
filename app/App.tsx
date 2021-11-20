import { StatusBar } from "expo-status-bar";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

import RoomScreen from "./screens/room_screen";
import BoardScreen from "./screens/board_screen";
import { BoardProvider } from "./contexts/board_context";

const BACKGROUND = "#E8EAED"

export default function App() {
  return (
    <BoardProvider>
      <View style={styles.container}>
        <RoomScreen></RoomScreen>
      </View>
    </BoardProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND
  },
});
