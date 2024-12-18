import React, { useEffect, useState, useCallback, memo } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Modal,
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

// ImageCard Component for better performance
interface ImageCardProps {
  photo: Photo;
  onImagePress: (url: string) => void;
  onDownload: (url: string) => void;
}

const ImageCard = memo(
  ({ photo, onImagePress, onDownload }: ImageCardProps) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => onImagePress(photo.url_s)}>
        <FastImage
          source={{
            uri: photo.url_s,
            priority: FastImage.priority.normal, // Lazy load
            cache: FastImage.cacheControl.immutable, // Cache for performance
          }}
          style={styles.image}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() => onDownload(photo.url_s)}
      >
        <Text style={styles.downloadText}>Download</Text>
      </TouchableOpacity>
    </View>
  )
);

const ImageGallery: React.FC = () => {
  const [images, setImages] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fetch images with caching
  const loadImages = useCallback(
    async (currentPage: number, isRefresh: boolean = false) => {
      if (!hasMore && !isRefresh) return;

      if (!isRefresh) setLoading(true);
      try {
        if (currentPage === 1) {
          const cachedData = await AsyncStorage.getItem("cachedImages");
          if (cachedData) setImages(JSON.parse(cachedData));
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

  // Load initial images
  useEffect(() => {
    loadImages(1);
  }, [loadImages]);

  // Load more images for pagination
  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadImages(nextPage);
    }
  };

  // Pull-to-refresh handler
  const refreshImages = () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    loadImages(1, true);
  };

  // Modal handlers
  const openModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  // Download image functionality
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

  return (
    <View style={styles.container}>
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
          renderItem={({ item }) => (
            <ImageCard
              photo={item}
              onImagePress={openModal}
              onDownload={downloadImage}
            />
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={refreshImages}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          getItemLayout={(_, index) => ({
            length: 250, // Approximate card height
            offset: 250 * index,
            index,
          })}
          ListFooterComponent={
            loading ? (
              <ActivityIndicator
                size="large"
                color="#007BFF"
                style={styles.loadingIndicator}
              />
            ) : null
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
              source={{
                uri: selectedImage,
                cache: FastImage.cacheControl.immutable,
              }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
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
