import axios from 'axios';

// Define interface for Flickr photo
interface FlickrPhoto {
  id: string;
  url_s?: string;
  title?: string;
}

// Flickr API configuration
const FLICKR_CONFIG = {
  BASE_URL: 'https://api.flickr.com/services/rest/',
  API_KEY: '6f102c62f41998d151e5a1b48713cf13',
  DEFAULT_PARAMS: {
    method: 'flickr.photos.getRecent',
    format: 'json',
    nojsoncallback: 1,
    extras: 'url_s',
    per_page: 20,
  }
};

/**
 * Fetch recent images from Flickr API
 * @param page - Page number for pagination (default: 1)
 * @returns Promise of filtered photo array
 */
export const fetchRecentImages = async (page: number = 1): Promise<FlickrPhoto[]> => {
  try {
    const response = await axios.get(FLICKR_CONFIG.BASE_URL, {
      params: {
        ...FLICKR_CONFIG.DEFAULT_PARAMS,
        api_key: FLICKR_CONFIG.API_KEY,
        page,
      },
    });

    // Filter out photos without small URL
    return response.data.photos.photo.filter((photo: FlickrPhoto) => 
      photo.url_s && photo.id
    );
  } catch (error) {
    // Enhanced error logging
    if (axios.isAxiosError(error)) {
      console.error('Flickr API Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
    } else {
      console.error('Unexpected error fetching images:', error);
    }
    
    return [];
  }
};