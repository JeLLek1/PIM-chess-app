import { StatusBar } from "expo-status-bar";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

import RoomScreen from "./screens/room_screen";
import BoardScreen from "./screens/board_screen";
import { BoardProvider } from "./contexts/board_context";
import { Router } from "./components/router";

const BACKGROUND = "#E8EAED"

export default function App() {
  return (
    <BoardProvider>
      <Router/>
    </BoardProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND
  },
});
