import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";

// Importing Screens
import HomeScreen from "./src/screens/HomeScreen";
import GalleryScreen from "./src/screens/GalleryScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import AboutScreen from "./src/screens/AboutScreen";

// Navigation
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Bottom Tab Navigator
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        let iconName: string = "help-outline"; // Default icon

        if (route.name === "Home") {
          iconName = "home-outline";
        } else if (route.name === "Gallery") {
          iconName = "images-outline";
        }

        // Ensure iconName is always defined
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "#007BFF",
      tabBarInactiveTintColor: "gray",
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Gallery" component={GalleryScreen} />
  </Tab.Navigator>
);

// Drawer Navigator
const DrawerNavigator = () => (
  <Drawer.Navigator
    screenOptions={({ route }) => ({
      drawerStyle: {
        backgroundColor: "#f9f9f9",
        width: 240,
      },
      drawerActiveTintColor: "#1E90FF",
      drawerInactiveTintColor: "gray",
      drawerItemStyle: {
        borderRadius: 8,
        marginVertical: 5,
        paddingHorizontal: 10,
      },
      drawerLabelStyle: {
        fontSize: 16,
        fontWeight: "500",
      },
      drawerIcon: ({ color, size }) => {
        // Assign default value to iconName
        let iconName: string = "help-outline"; // Default icon

        // Conditionally set the icon based on route.name
        if (route.name === "Main") {
          iconName = "home-outline";
        } else if (route.name === "Settings") {
          iconName = "settings-outline";
        } else if (route.name === "About") {
          iconName = "information-circle-outline";
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Drawer.Screen name="Main" component={TabNavigator} />
    <Drawer.Screen name="Settings" component={SettingsScreen} />
    <Drawer.Screen name="About" component={AboutScreen} />
  </Drawer.Navigator>
);

// App Component
const App = () => {
  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
};

export default App;
