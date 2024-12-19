import React, { useEffect, useState, useCallback, memo } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  Alert,
  useWindowDimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Image as ExpoImage } from "expo-image";
import { fetchRecentImages } from "../api/flickr";
import { Ionicons } from "@expo/vector-icons";
import { Image as RNImage, StyleProp, ImageStyle } from "react-native";

const getNumberOfColumns = (screenWidth: number) => {
  if (screenWidth >= 1200) return 5;
  if (screenWidth >= 992) return 4;
  if (screenWidth >= 768) return 3;
  return 2;
};

// Photo type def
interface Photo {
  id: string;
  url_s: string;
  title: string;
}

// ImageComponent Props Interface
interface ImageComponentProps {
  uri: string;
  style?: StyleProp<ImageStyle>;
}

// ImageComponent with Proper Typing
const ImageComponent: React.FC<ImageComponentProps> = ({ uri, style }) => {
  if (Platform.OS === "web") {
    return <RNImage source={{ uri }} style={style} />;
  }
  return (
    <ExpoImage
      source={{ uri }}
      style={style}
      contentFit="cover"
      cachePolicy="memory-disk"
      transition={200}
      placeholder={Platform.select({
        android: "shimmer",
        ios: "blur",
      })}
    />
  );
};

// ImageCard Component for better performance
interface ImageCardProps {
  photo: Photo;
  onImagePress: (photo: Photo) => void;
  onDownload: (url: string) => void;
}

const ImageCard = memo(
  ({ photo, onImagePress, onDownload }: ImageCardProps) => (
    <View style={styles.card}>
      {/* Photo Title */}
      <Text style={styles.photoTitle}>{photo.title}</Text>

      {/* Image */}
      <TouchableOpacity onPress={() => onImagePress(photo)}>
        <ImageComponent uri={photo.url_s} style={styles.image} />
      </TouchableOpacity>

      {/* Download Button */}
      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() => onDownload(photo.url_s)}
        activeOpacity={0.7}
      >
        <Ionicons
          name="download-outline"
          size={16}
          color="#fff"
          style={styles.downloadIcon}
        />
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
  const [selectedImage, setSelectedImage] = useState<Photo | null>(null);

  const { width: screenWidth } = useWindowDimensions();
  const [numColumns, setNumColumns] = useState<number>(
    getNumberOfColumns(screenWidth)
  );

  // Update number of columns whenever screen width changes
  useEffect(() => {
    setNumColumns(getNumberOfColumns(screenWidth));
  }, [screenWidth]);

  // Fetch images with caching
  const loadImages = useCallback(
    async (currentPage: number, isRefresh: boolean = false) => {
      if (!hasMore && !isRefresh) return;

      if (!isRefresh) setLoading(true);
      try {
        if (currentPage === 1 && !isRefresh) {
          const cachedData = await AsyncStorage.getItem("cachedImages");
          if (cachedData) setImages(JSON.parse(cachedData));
        }

        const fetchedImages = await fetchRecentImages(currentPage);
        if (fetchedImages.length === 0) {
          setHasMore(false);
          return;
        }

        const photos: Photo[] = fetchedImages.map((photo: any) => ({
          id: photo.id,
          url_s: photo.url_s,
          title: photo.title,
        }));

        setImages((prev) =>
          isRefresh || currentPage === 1 ? photos : [...prev, ...photos]
        );

        if (currentPage === 1 && !isRefresh) {
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

  // Reload Gallery handler
  const reloadGallery = async () => {
    try {
      // Confirm with the user before reloading
      Alert.alert(
        "Reload Gallery",
        "Are you sure you want to reload the gallery? This will fetch new images.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Reload",
            style: "destructive",
            onPress: async () => {
              // Clears the cached images
              await AsyncStorage.removeItem("cachedImages");
              // Resets da state
              setImages([]);
              setPage(1);
              setHasMore(true);
              setError(null);
              // Fetchs new images
              loadImages(1, true);
            },
          },
        ]
      );
    } catch (err) {
      console.error("Error reloading gallery:", err);
      setError("Failed to reload images. Please try again.");
    }
  };

  // Modal handlers
  const openModal = (photo: Photo) => {
    setSelectedImage(photo);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  // Download image functionality with platform check
  const handleDownloadImage = (imageUrl: string) => {
    if (Platform.OS === "web") {
      // For web, use the web-specific download function
      downloadImage(imageUrl);
    } else {
      // For native platforms, use expo-sharing
      downloadImage(imageUrl);
    }
  };

  // Download image functionality
  const downloadImage = async (imageUrl: string) => {
    if (Platform.OS === "web") {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `image_${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // For native platforms, use expo-sharing
      try {
        const fileUri = `${
          FileSystem.documentDirectory
        }image_${Date.now()}.jpg`;
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
    }
  };

  // Render Header with Enhanced UI
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerLeft}>
        <Text style={styles.headerText}>📸 Photo Gallery</Text>
        <Text style={styles.totalPhotos}>{images.length} photos</Text>
      </View>
      <TouchableOpacity
        style={styles.reloadButton}
        onPress={reloadGallery}
        accessibilityLabel="Reload Gallery"
        accessible={true}
        activeOpacity={0.7}
      >
        <Ionicons
          name="reload-outline"
          size={20}
          color="#fff"
          style={styles.reloadIcon}
        />
        <Text style={styles.reloadButtonText}>Reload</Text>
      </TouchableOpacity>
    </View>
  );

  // Render Empty State with Enhanced UI
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Ionicons name="images-outline" size={64} color="#6c757d" />
      <Text style={styles.emptyStateText}>
        No images found. Pull down to refresh and try again.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#dc3545" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => loadImages(1)}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={images}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <ImageCard
              photo={item}
              onImagePress={() => openModal(item)}
              onDownload={handleDownloadImage}
            />
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={refreshImages}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={!loading ? renderEmptyState : null}
          numColumns={numColumns}
          contentContainerStyle={images.length === 0 && { flex: 1 }}
          getItemLayout={(_, index) => ({
            length: 300, // Adjusted for title and image
            offset: 300 * index,
            index,
          })}
          ListFooterComponent={
            loading ? (
              <ActivityIndicator
                size="large"
                color="#0d6efd"
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
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Ionicons name="close-circle" size={32} color="#fff" />
            </TouchableOpacity>

            {selectedImage && (
              <>
                <Text style={styles.modalTitle}>{selectedImage.title}</Text>
                <ImageComponent
                  uri={selectedImage.url_s}
                  style={styles.modalImage}
                />
                <TouchableOpacity
                  style={styles.modalDownloadButton}
                  onPress={() => handleDownloadImage(selectedImage.url_s)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="download-outline" size={20} color="#fff" />
                  <Text style={styles.downloadText}>Download Image</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Enhanced Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    paddingTop: Platform.OS === "web" ? 20 : 10,
  },
  card: {
    flex: 1,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: Platform.OS === "web" ? 0.3 : 0.1,
    shadowRadius: Platform.OS === "web" ? 4 : 3.84,
    elevation: Platform.OS === "web" ? 5 : 4,
    // Transition for hover effect
    ...(Platform.OS === "web" && {
      transition: "transform 0.2s, box-shadow 0.2s",
      ":hover": {
        transform: [{ scale: 1.03 }],
        shadowOpacity: 0.4,
      },
    }),
  },
  photoTitle: {
    padding: 10,
    fontSize: Platform.OS === "web" ? 18 : 16,
    fontWeight: "600",
    color: "#333",
    backgroundColor: "#e9ecef",
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 150,
    backgroundColor: "#dfe4ea",
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0d6efd",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: "#dee2e6",
  },
  downloadIcon: {
    marginRight: 6,
  },
  downloadText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f8d7da",
  },
  errorText: {
    color: "#721c24",
    fontSize: 16,
    marginVertical: 10,
    textAlign: "center",
  },
  retryText: {
    color: "#0d6efd",
    textDecorationLine: "underline",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  loadingIndicator: {
    marginVertical: 30,
    transform: [{ scale: 1.2 }],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 800,
    backgroundColor: "#333",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
  },
  modalImage: {
    width: "100%",
    height: 400,
    borderRadius: 8,
    marginBottom: 15,
  },
  modalDownloadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0d6efd",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: Platform.OS === "web" ? 0.3 : 0.1,
    shadowRadius: Platform.OS === "web" ? 4 : 3.84,
    elevation: Platform.OS === "web" ? 5 : 4,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
  },
  headerLeft: {
    flex: 1,
    alignItems: Platform.OS === "web" ? "center" : "flex-start",
  },
  headerText: {
    fontSize: Platform.OS === "web" ? 24 : 20,
    fontWeight: "700",
    color: "#212529",
    textAlign: "center",
  },
  totalPhotos: {
    fontSize: Platform.OS === "web" ? 18 : 14,
    color: "#6c757d",
    textAlign: "center",
    marginTop: 4,
  },
  reloadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0d6efd",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: Platform.OS === "web" ? 0.3 : 0.1,
    shadowRadius: Platform.OS === "web" ? 4 : 3.84,
    elevation: Platform.OS === "web" ? 5 : 4,
    // Hover effect for da web
    ...(Platform.OS === "web" && {
      ":hover": {
        transform: [{ scale: 1.05 }],
        shadowOpacity: 0.4,
      },
    }),
  },
  reloadIcon: {
    marginRight: 6,
  },
  reloadButtonText: {
    color: "#fff",
    fontSize: Platform.OS === "web" ? 16 : 14,
    fontWeight: "600",
    textAlign: "center",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  emptyStateText: {
    fontSize: 18,
    color: "#6c757d",
    textAlign: "center",
    marginTop: 10,
  },
});

export default ImageGallery;
