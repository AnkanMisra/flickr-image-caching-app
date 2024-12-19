import { StyleSheet, Dimensions } from "react-native";
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 20,
    paddingTop: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E90FF",
    marginBottom: 20,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    lineHeight: 24,
  },
  link: {
    color: "#1E90FF", 
    textDecorationLine: "underline", 
    fontWeight: "bold", 
  },
});

export default styles;