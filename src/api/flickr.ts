import axios from "axios";

//Makes the Interface
interface FlickrPhoto {
  id: string;
  url_s?: string;
  title?: string;
}

// Flickr API config
const FLICKR_CONFIG = {
  BASE_URL: "https://api.flickr.com/services/rest/",
  API_KEY: "6f102c62f41998d151e5a1b48713cf13", //Api key
  DEFAULT_PARAMS: {
    method: "flickr.photos.getRecent",
    format: "json",
    nojsoncallback: 1,
    extras: "url_s",
    per_page: 20,
  },
};

/**
 * Fetch recent images from Flickr Api
 * @param page - Page number for pagination 
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

    console.log("Flickr API Response:", response.data);

    // Validate with filter the response structure
    if (
      response.data &&
      response.data.photos &&
      Array.isArray(response.data.photos.photo)
    ) {
      return response.data.photos.photo.filter((photo: FlickrPhoto) => 
        photo.url_s && photo.id
      );
    } else {
      console.error("Unexpected response structure:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
};