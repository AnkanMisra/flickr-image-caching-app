# React Native Image Gallery App

This project is a React Native application that serves as an image gallery, fetching recent images from Flickr and displaying them in an organized format. The app also implements image caching to ensure the gallery is available offline and maintains the latest updates when the API response changes.

---

## Features

- **Recent Images:** Fetches and displays the latest images from Flickr on the homepage using Flickr's API.
- **Offline Support:** Caches image links to ensure the gallery is available even without an internet connection.
- **Dynamic Updates:** Automatically refreshes the homepage when there is a change in the API response, similar to Instagram's behavior.
- **User-Friendly Navigation:** Includes a left navbar with a "Home" option for ease of use.

---

## Technology Stack

- **Framework:** React Native
- **API:** Flickr API
- **Caching:** Async Storage (to cache image links)

---

## API Details

### Recent Images Endpoint

- **Endpoint URL:**  
  `https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&per_page=20&page=1&format=json&nojsoncallback=1&extras=url_s`

- **Response Format:** JSON
- **Extras Parameter:** `url_s` ensures image URLs are included in the response.

---

## Implementation Details

### Caching Logic

1. **Cache Links:** Image links are saved in Async Storage.
2. **Offline Loading:** If the app is offline, cached links are retrieved and displayed.
3. **API Refresh:** On re-opening the app, the API is queried, and changes in the response update the view.

### UI Design

- The homepage showcases recent images in a visually appealing grid.
- A left sidebar with a "Home" option provides seamless navigation.
- Offline support ensures consistent user experience.

---

## Usage

1. **Clone the Repository:**  
   ```bash
   git clone https://github.com/your-repo/image-gallery-app.git
   cd image-gallery-app
   ```

2. **Install Dependencies:**  
   ```bash
   npm install
   ```
3. **Run the App:**  
   ```bash
   npx react-native run-android
  or
  ```bash
npx react-native run-ios
  ```

4. **Build the APK (Optional):**  
   ```bash
   npx react-native run-android --variant=release
   ```

---

## Submission Requirements

To complete the project, submit the following:

1. **Functionality Video:** A 1-minute video demonstrating the app's functionality.
2. **GitHub Repository:** Only provide the repository if explicitly requested.

---

## Notes and References

- **Caching Tip:** Caching image links ensures images are loaded automatically once the links are cached.
- **API Reference:**  
  [Flickr API Documentation](https://www.flickr.com/services/api/)

- **Source Document:**  
  [Original Task Description](https://justpaste.it/24ngp)
