import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Linking } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"; // Icons for LinkedIn and GitHub
import styles from "./AboutScreens";

const AboutScreen: React.FC = () => {
  const openLinkedIn = () => {
    Linking.openURL("https://linkedin.com/in/ankanmisra").catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  const openGitHub = () => {
    Linking.openURL("https://github.com/ankanmisra").catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  const openLeetCode = () => {
    Linking.openURL("https://leetcode.com/ankanmisra").catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>About Me</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.description}>
          Hi there! 👋 I'm <Text style={styles.highlight}>Ankan Misra</Text>, a
          passionate Web and Swift Developer specializing in:
        </Text>
        <Text style={styles.listItem}>• Full-stack development</Text>
        <Text style={styles.listItem}>• Competitive programming</Text>
        <Text style={styles.listItem}>• Data analysis</Text>
        <Text style={styles.description}>
          I'm currently pursuing a Computer Science degree and exploring
          innovative solutions through technology.
        </Text>
      </View>
      <TouchableOpacity onPress={openLinkedIn} style={styles.linkedinButton}>
        <Icon
          name="linkedin-square"
          size={20}
          color="#fff"
          style={styles.icon}
        />
        <Text style={styles.linkText}>Connect with me on LinkedIn</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={openGitHub} style={styles.githubButton}>
        <Icon name="github" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.linkText}>Check out my GitHub</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={openLeetCode} style={styles.leetcodeButton}>
        <Image
          source={require("../../assets/images/hehe.png")}
          style={styles.leetcodeIcon}
        />
        <Text style={styles.linkText}>View my LeetCode</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AboutScreen;
