import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import ImageGallery from "../components/ImageGallery";
const GalleryScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ImageGallery />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
});

export default GalleryScreen;
