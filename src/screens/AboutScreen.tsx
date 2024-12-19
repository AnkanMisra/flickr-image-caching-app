import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
  Alert,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "./styles/AboutScreens";

const AboutScreen: React.FC = () => {
  const openLinkedIn = () => {
    Linking.openURL("https://linkedin.com/in/ankanmisra").catch((err) =>
      console.error("Failed to open LinkedIn URL:", err)
    );
  };

  const openGitHub = () => {
    Linking.openURL("https://github.com/ankanmisra").catch((err) =>
      console.error("Failed to open GitHub URL:", err)
    );
  };

  const openLeetCode = () => {
    Linking.openURL("https://leetcode.com/ankanmisra").catch((err) =>
      console.error("Failed to open LeetCode URL:", err)
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>About Me</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.card}>
          <Text style={styles.description}>
            Hi there! 👋 I'm <Text style={styles.highlight}>Ankan Misra</Text>,
            a passionate Web and Swift Developer specializing in:
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• Full-stack development</Text>
            <Text style={styles.listItem}>• Competitive programming</Text>
            <Text style={styles.listItem}>• Data analysis</Text>
          </View>
          <Text style={styles.description}>
            I'm currently pursuing a Computer Science degree and exploring
            innovative solutions through technology.
          </Text>
        </View>

        {/* Social Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={openLinkedIn}
            style={styles.linkedinButton}
            accessibilityLabel="Connect with me on LinkedIn"
          >
            <Icon
              name="linkedin-square"
              size={20}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.linkText}>Connect on LinkedIn</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={openGitHub}
            style={styles.githubButton}
            accessibilityLabel="Check out my GitHub"
          >
            <Icon name="github" size={20} color="#fff" style={styles.icon} />
            <Text style={styles.linkText}>View GitHub</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={openLeetCode}
            style={styles.leetcodeButton}
            accessibilityLabel="View my LeetCode Profile"
          >
            <Image
              source={require("../../assets/images/hehe.png")} // Ensure this path is correct
              style={styles.leetcodeIcon}
            />
            <Text style={styles.linkText}>LeetCode Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutScreen;
