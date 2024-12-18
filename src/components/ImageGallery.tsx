import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Image,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchRecentImages } from "../api/flickr";

// Defines the structure of a photo object from API
interface Photo {
  id: string;
  url_s: string;
}

// Type for Flickr API response to improve type safety
interface FlickrPhoto {
  id: string;
  url_s?: string;
}

const ImageGallery: React.FC = () => {
  const [images, setImages] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadImages = useCallback(
    async (currentPage: number) => {
      if (!hasMore && currentPage > 1) return;

      setLoading(currentPage === 1);

      try {
        if (currentPage === 1) {
          const cachedData = await AsyncStorage.getItem("cachedImages");
          if (cachedData) {
            const parsedCache = JSON.parse(cachedData);
            setImages(parsedCache);
          }
        }

        const recentImages = await fetchRecentImages(currentPage);

        if (recentImages.length === 0) {
          setHasMore(false);
          return;
        }

        const photos = recentImages
          .filter((photo: FlickrPhoto) => photo.url_s)
          .map((photo: FlickrPhoto) => ({
            id: photo.id,
            url_s: photo.url_s!,
          }));

        setImages((prevImages) =>
          currentPage === 1 ? photos : [...prevImages, ...photos]
        );

        if (currentPage === 1) {
          await AsyncStorage.setItem("cachedImages", JSON.stringify(photos));
        }

        setError(null);
      } catch (err) {
        console.error("Error loading images:", err);
        setError(
          "Unable to load images. Please check your network connection."
        );
      } finally {
        setLoading(false);
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

  const renderItem = ({ item }: { item: Photo }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.url_s }}
        style={styles.image}
        resizeMode="cover"
      />
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Image Gallery</Text>
      </View>

      {/* Image List */}
      <FlatList
        data={images}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator size="large" style={styles.loadingIndicator} />
          ) : null
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
    backgroundColor: "#f2f2f2",
  },
  header: {
    paddingVertical: 15,
    backgroundColor: "#007BFF",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginBottom: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Android shadow
  },
  image: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
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
    textAlign: "center",
    marginBottom: 10,
  },
  retryText: {
    color: "#007BFF",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#6c757d",
  },
  loadingIndicator: {
    marginVertical: 20,
  },
});

export default ImageGallery;
