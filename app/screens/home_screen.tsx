import { StatusBar } from "expo-status-bar";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

const BACKGROUND = "rgb(36,32,30)"

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Hello World in home!</Text>
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