import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ImageGallery from './src/components/ImageGallery';

const App: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string>('Home');

  const renderContent = () => {
    switch (activeMenu) {
      case 'Home':
        return <ImageGallery />;
      case 'Gallery':
        return <Text style={styles.placeholderText}>Gallery Content Coming Soon!</Text>;
      case 'Settings':
        return <Text style={styles.placeholderText}>Settings Page Coming Soon!</Text>;
      default:
        return <Text style={styles.placeholderText}>Invalid Page</Text>;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <Text style={styles.menuTitle}>Menu</Text>

          <TouchableOpacity
            style={[styles.menuItem, activeMenu === 'Home' && styles.activeMenuItem]}
            onPress={() => setActiveMenu('Home')}
          >
            <Text style={[styles.menuText, activeMenu === 'Home' && styles.activeMenuText]}>
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, activeMenu === 'Gallery' && styles.activeMenuItem]}
            onPress={() => setActiveMenu('Gallery')}
          >
            <Text style={[styles.menuText, activeMenu === 'Gallery' && styles.activeMenuText]}>
              Gallery
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, activeMenu === 'Settings' && styles.activeMenuItem]}
            onPress={() => setActiveMenu('Settings')}
          >
            <Text style={[styles.menuText, activeMenu === 'Settings' && styles.activeMenuText]}>
              Settings
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.content}>{renderContent()}</View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  container: {
    flexDirection: 'row',
    flex: 1,
  },
  sidebar: {
    width: 120,
    backgroundColor: '#eee',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginVertical: 5,
    borderRadius: 5,
  },
  activeMenuItem: {
    backgroundColor: '#007BFF',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  activeMenuText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  placeholderText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#6c757d',
  },
});

export default App;