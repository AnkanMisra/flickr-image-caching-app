import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import FastImage from "expo-fast-image";
import { fetchRecentImages } from "../api/flickr";

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

  const downloadImage = async (url: string) => {
    try {
      const fileName = url.split("/").pop();
      const fileUri = FileSystem.documentDirectory + fileName;

      const { uri } = await FileSystem.downloadAsync(url, fileUri);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert("Download Complete", "Image saved to: " + uri);
      }
    } catch (err) {
      console.error("Error downloading image:", err);
      Alert.alert("Error", "Failed to download the image. Try again.");
    }
  };

  const renderItem = ({ item }: { item: Photo }) => (
    <View style={styles.card}>
      <FastImage
        source={{ uri: item.url_s }}
        style={styles.image}
        resizeMode="cover"
      />
      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() => downloadImage(item.url_s)}
      >
        <Text style={styles.downloadText}>Download</Text>
      </TouchableOpacity>
    </View>
  );

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.retryText} onPress={() => loadImages(1)}>
          Retry
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Image Gallery</Text>
      </View>
      <FlatList
        data={images}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={refreshImages}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="#007BFF" /> : null
        }
        ListEmptyComponent={
          !loading && <Text style={styles.emptyText}>No images available</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginBottom: 15,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  image: {
    width: "100%",
    height: 250,
  },
  downloadButton: {
    backgroundColor: "#28A745",
    paddingVertical: 10,
    alignItems: "center",
  },
  downloadText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
  },
  retryText: {
    color: "#007BFF",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 18,
    color: "#555",
    marginTop: 20,
  },
});

export default ImageGallery;
