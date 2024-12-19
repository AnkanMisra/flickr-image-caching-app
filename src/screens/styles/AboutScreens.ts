// styles/AboutScreens.ts

import { StyleSheet, Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#e9eff7",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  header: {
    marginBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 28, // Adjusted for better readability
    fontWeight: "700",
    color: "#1E90FF",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 30,
    width: SCREEN_WIDTH * 0.9, // 90% of screen width for responsiveness
    alignItems: "center", // Centers content horizontally
  },
  description: {
    fontSize: 18,
    color: "#4a4a4a",
    textAlign: "center",
    marginVertical: 10,
    lineHeight: 26,
  },
  highlight: {
    fontWeight: "bold",
    color: "#1E90FF",
  },
  list: {
    width: "100%", // Ensures the list takes full width of the card
    alignItems: "center", // Centers the list items horizontally
    marginVertical: 10,
  },
  listItem: {
    fontSize: 17,
    color: "#007BFF",
    textAlign: "center", // Centers the text within each list item
    marginVertical: 5,
    fontStyle: "italic",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  linkedinButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    paddingVertical: 14,
    paddingHorizontal: 25,
    backgroundColor: "#0077B5", // LinkedIn Blue
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#005582",
    width: "100%",
    maxWidth: 350,
  },
  githubButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    paddingVertical: 14,
    paddingHorizontal: 25,
    backgroundColor: "#333333", // GitHub Black
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#1a1a1a",
    width: "100%",
    maxWidth: 350,
  },
  leetcodeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    paddingVertical: 14,
    paddingHorizontal: 25,
    backgroundColor: "#FFA500", // LeetCode Orange
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#FF8C00",
    width: "100%",
    maxWidth: 350,
  },
  leetcodeIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    resizeMode: "contain",
  },
  icon: {
    marginRight: 10,
  },
  linkText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});

export default styles;