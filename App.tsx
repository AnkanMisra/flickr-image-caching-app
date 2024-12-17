import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import ImageGallery from './src/components/ImageGallery';

const App: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <View style={{ width: 100, backgroundColor: '#eee', padding: 10 }}>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Home</Text>
        </View>
        <View style={{ flex: 1 }}>
          <ImageGallery />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default App;
