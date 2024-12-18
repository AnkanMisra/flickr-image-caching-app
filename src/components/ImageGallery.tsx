import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FastImage from "expo-fast-image";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { fetchRecentImages } from "../api/flickr";

// Photo type definition
interface Photo {
  id: string;
  url_s: string;
}

const ImageGallery: React.FC = () => {
  const [images, setImages] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const loadImages = useCallback(
    async (currentPage: number, isRefresh: boolean = false) => {
      if (!hasMore && !isRefresh) return;

      if (!isRefresh) setLoading(true);
      try {
        if (currentPage === 1) {
          const cachedData = await AsyncStorage.getItem("cachedImages");
          if (cachedData) {
            setImages(JSON.parse(cachedData));
          }
        }

        const fetchedImages = await fetchRecentImages(currentPage);
        if (fetchedImages.length === 0) {
          setHasMore(false);
          return;
        }

        const photos = fetchedImages.map((photo: any) => ({
          id: photo.id,
          url_s: photo.url_s,
        }));

        setImages((prev) =>
          isRefresh || currentPage === 1 ? photos : [...prev, ...photos]
        );

        if (currentPage === 1) {
          await AsyncStorage.setItem("cachedImages", JSON.stringify(photos));
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching images:", err);
        setError("Failed to load images. Check your connection and retry.");
      } finally {
        setLoading(false);
        if (isRefresh) setRefreshing(false);
      }
    },
    [hasMore]
  );

  useEffect(() => {
    loadImages(1);
  }, [loadImages]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadImages(nextPage);
    }
  };

  const refreshImages = () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    loadImages(1, true);
  };

  const openModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const downloadImage = async (imageUrl: string) => {
    try {
      const fileUri = `${FileSystem.documentDirectory}image_${Date.now()}.jpg`;
      const result = await FileSystem.downloadAsync(imageUrl, fileUri);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(result.uri);
      } else {
        alert("Sharing is not available on this device.");
      }
    } catch (error) {
      console.error("Error downloading the image:", error);
      alert("Failed to download the image.");
    }
  };

  const renderItem = ({ item }: { item: Photo }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => openModal(item.url_s)}>
        <FastImage
          source={{ uri: item.url_s }}
          style={styles.image}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() => downloadImage(item.url_s)}
      >
        <Text style={styles.downloadText}>Download</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Image Gallery</Text>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.retryText} onPress={() => loadImages(1)}>
            Retry
          </Text>
        </View>
      ) : (
        <FlatList
          data={images}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={renderItem}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={refreshImages}
          ListFooterComponent={
            loading && (
              <ActivityIndicator
                size="large"
                color="#007BFF"
                style={styles.loadingIndicator}
              />
            )
          }
          ListEmptyComponent={
            !loading && (
              <Text style={styles.emptyText}>No images available</Text>
            )
          }
        />
      )}

      {/* Image Preview Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
          {selectedImage && (
            <FastImage
              source={{ uri: selectedImage }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          )}
          <Button
            title="Download Image"
            onPress={() => {
              if (selectedImage) downloadImage(selectedImage);
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  card: {
    marginHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 3,
  },
  image: { width: "100%", height: 200 },
  downloadButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 8,
    alignItems: "center",
  },
  downloadText: { color: "#fff", fontWeight: "bold" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", fontSize: 16, marginBottom: 10 },
  retryText: { color: "#007BFF", textDecorationLine: "underline" },
  loadingIndicator: { marginVertical: 20 },
  emptyText: { textAlign: "center", marginTop: 20, color: "#555" },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: { width: "90%", height: "80%" },
  closeButton: { position: "absolute", top: 40, right: 20 },
  closeText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default ImageGallery;
