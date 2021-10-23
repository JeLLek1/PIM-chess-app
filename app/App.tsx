import { StatusBar } from "expo-status-bar";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import BoardScreen from "./screens/board_screen";

const BACKGROUND = "rgb(36,32,30)"

export default function App() {
  return (
    <View style={styles.container}>
      <BoardScreen></BoardScreen>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: BACKGROUND
  },
});
