import React from "react";
import { View, Text } from "react-native";
import styles from "./styles/HomeScreen"; // Adjust path as needed

const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Welcome Text */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Welcome to the Image Gallery App</Text>
        <Text style={styles.subtitle}>
          Discover a world of stunning visuals, dynamically curated and
          beautifully organized for you.
        </Text>
      </View>
    </View>
  );
};

export default HomeScreen;
