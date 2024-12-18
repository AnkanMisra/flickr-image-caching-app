import React from "react";
import { View, Text, StyleSheet } from "react-native";

const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Text style={styles.description}>
        Welcome to the Image Gallery App! Explore the app using the navigation
        menu.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007BFF",
  },
  description: {
    fontSize: 16,
    color: "#555",
    marginTop: 10,
    textAlign: "center",
  },
});

export default HomeScreen;
