import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Room from "../components/room";

const BACKGROUND = "rgb(36,32,30)"

export default function RoomScreen() {
  return (
    <View style={styles.roomBackground}>
      <Text style={styles.sectionTitle}>Lista pokoi:</Text>
      <View style={styles.roomList}>
        <Room text={'Pokój 1'}/>
        <Room text={'Pokój 2'}/>
        <Room text={'Pokój 3'}/>
        <Room text={'Pokój 4'}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED'
  },
  roomBackground: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold"
  },
  roomList: {

  },
});