import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import ImageGallery from "./src/components/ImageGallery";

const App: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string>("Home");

  const renderContent = () => {
    switch (activeMenu) {
      case "Home":
        return (
          <ScrollView contentContainerStyle={styles.homeContainer}>
            {/* Banner Image */}
            <Image
              source={{
                uri: "https://via.placeholder.com/800x200?text=Welcome+to+Image+Gallery",
              }}
              style={styles.banner}
            />
            {/* Title */}
            <Text style={styles.homeTitle}>
              Welcome to the Image Gallery App
            </Text>

            <Text style={styles.homeText}>
              This project showcases a dynamic collection of images fetched from
              the Flickr API. Explore the following sections to get started:
            </Text>

            <View style={styles.listContainer}>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>
                  Home: Learn about the project.
                </Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>
                  Gallery: Browse the dynamic collection of photos.
                </Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.listText}>
                  Settings: More features coming soon!
                </Text>
              </View>
            </View>
          </ScrollView>
        );

      case "Gallery":
        return <ImageGallery />;

      case "Settings":
        return (
          <View style={styles.centeredContainer}>
            <Text style={styles.placeholderText}>
              Settings Page Coming Soon!
            </Text>
          </View>
        );

      default:
        return <Text>Invalid Page</Text>;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <Text style={styles.menuTitle}>Menu</Text>

          <TouchableOpacity
            style={[
              styles.menuItem,
              activeMenu === "Home" && styles.activeMenuItem,
            ]}
            onPress={() => setActiveMenu("Home")}
          >
            <Text
              style={[
                styles.menuText,
                activeMenu === "Home" && styles.activeMenuText,
              ]}
            >
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.menuItem,
              activeMenu === "Gallery" && styles.activeMenuItem,
            ]}
            onPress={() => setActiveMenu("Gallery")}
          >
            <Text
              style={[
                styles.menuText,
                activeMenu === "Gallery" && styles.activeMenuText,
              ]}
            >
              Gallery
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.menuItem,
              activeMenu === "Settings" && styles.activeMenuItem,
            ]}
            onPress={() => setActiveMenu("Settings")}
          >
            <Text
              style={[
                styles.menuText,
                activeMenu === "Settings" && styles.activeMenuText,
              ]}
            >
              Settings
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.content}>{renderContent()}</View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  container: {
    flexDirection: "row",
    flex: 1,
  },
  sidebar: {
    width: 120,
    backgroundColor: "#eee",
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginVertical: 5,
    borderRadius: 5,
  },
  activeMenuItem: {
    backgroundColor: "#007BFF",
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },
  activeMenuText: {
    color: "#fff",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  homeContainer: {
    padding: 20,
    alignItems: "center",
  },
  banner: {
    width: "100%",
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  homeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007BFF",
    textAlign: "center",
    marginBottom: 10,
  },
  homeText: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
  },
  listContainer: {
    width: "100%",
    marginTop: 10,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  bullet: {
    fontSize: 20,
    color: "#007BFF",
    marginRight: 8,
  },
  listText: {
    fontSize: 16,
    color: "#333",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#777",
  },
});

export default App;
