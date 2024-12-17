import React, { useEffect, useState, useCallback } from 'react';
import { View, Image, FlatList, ActivityIndicator, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchRecentImages } from '../api/flickr';

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
  // Manage component state for images, loading, and pagination
  const [images, setImages] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch and process images from Flickr API with caching
  const loadImages = useCallback(async (currentPage: number) => {
    // Prevent unnecessary API calls when no more images are available
    if (!hasMore && currentPage > 1) return;

    // Manage loading state for initial page load
    setLoading(currentPage === 1);
    
    try {
      // Retrieve cached images for initial page load
      if (currentPage === 1) {
        const cachedData = await AsyncStorage.getItem('cachedImages');
        if (cachedData) {
          const parsedCache = JSON.parse(cachedData);
          setImages(parsedCache);
        }
      }

      // Fetch recent images from Flickr
      const recentImages = await fetchRecentImages(currentPage);
      
      // Handle case when no more images are available
      if (recentImages.length === 0) {
        setHasMore(false);
        return;
      }

      // Transform API response to our Photo interface with type safety
      const photos = recentImages
        .filter((photo: FlickrPhoto) => photo.url_s)
        .map((photo: FlickrPhoto) => ({
          id: photo.id,
          url_s: photo.url_s!
        }));

      // Update images state - replace on first page, append on subsequent pages
      setImages(prevImages => 
        currentPage === 1 
          ? photos 
          : [...prevImages, ...photos]
      );

      // Update cache for initial page load
      if (currentPage === 1) {
        await AsyncStorage.setItem('cachedImages', JSON.stringify(photos));
      }

      // Clear any previous errors
      setError(null);
    } catch (error) {
      // Log and handle API or network errors
      console.error('Error loading images:', error);
      setError('Unable to load images. Please check your network connection.');
    } finally {
      // Ensure loading state is reset
      setLoading(false);
    }
  }, [hasMore]);

  // Initial image load on component mount
  useEffect(() => {
    loadImages(1);
  }, [loadImages]);

  // Handle infinite scroll pagination
  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadImages(nextPage);
    }
  };

  // Render individual image item
  const renderItem = ({ item }: { item: Photo }) => (
    <Image
      source={{ uri: item.url_s }}
      style={styles.image}
      resizeMode="cover"
    />
  );

  // Render error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Text 
          style={styles.retryText}
          onPress={() => loadImages(1)}
        >
          Retry
        </Text>
      </View>
    );
  }

  // Main component render with FlatList
  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        // Render loading indicator during pagination
        ListFooterComponent={loading ? <ActivityIndicator size="large" /> : null}
        // Display empty state when no images are available
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.emptyText}>No images available</Text>
          ) : null
        }
      />
    </View>
  );
};

// Stylesheet for component styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  retryText: {
    color: 'blue',
    marginTop: 10,
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default ImageGallery;