import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e9eff7",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
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
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 20,
    width: "100%",
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
  listItem: {
    fontSize: 17,
    color: "#007BFF",
    textAlign: "center",
    marginVertical: 5,
    fontStyle: "italic",
  },
  linkedinButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    paddingVertical: 14,
    paddingHorizontal: 25,
    backgroundColor: "#007BFF", // Blue for LinkedIn
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#0056b3",
  },
  githubButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    paddingVertical: 14,
    paddingHorizontal: 25,
    backgroundColor: "#000", // Black for GitHub
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#333", // Slightly lighter black border
  },
  leetcodeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    paddingVertical: 14,
    paddingHorizontal: 25,
    backgroundColor: "rgba(255, 165, 0, 0.7)", // Orange for LeetCode
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: "black", // Slightly darker orange border
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