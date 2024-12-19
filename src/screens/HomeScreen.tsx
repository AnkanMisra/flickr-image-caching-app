import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  Alert,
  SafeAreaView,
} from "react-native";
import styles from "./styles/HomeScreen";

const HomeScreen: React.FC = () => {
  const openPersonalWebsite = () => {
    Linking.openURL("https://ankanmisra.me").catch((err) => {
      console.error("Failed to open URL:", err);
      Alert.alert(
        "Error",
        "Unable to open the website. Please try again later."
      );
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Welcome Text */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Welcome to the Image Gallery App</Text>
          <Text style={styles.subtitle}>
            Discover a world of stunning visuals, dynamically curated and
            beautifully organized for you.{"\n"}
            Made By{"\n"}
            <Text
              style={styles.link}
              onPress={openPersonalWebsite}
              accessibilityRole="link"
              accessibilityLabel="Visit AnkanMisra's personal website"
            >
              AnkanMisra
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
