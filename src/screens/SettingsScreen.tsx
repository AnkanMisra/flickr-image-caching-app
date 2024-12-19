import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // For icons
import styles from "./styles/SettingsScreen"; // Ensure the correct path

const SettingsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [scaleValue] = useState(new Animated.Value(1)); // Animation state for scaling effect

  const animatePressIn = () => {
    Animated.timing(scaleValue, {
      toValue: 0.95,
      duration: 150,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start();
  };

  const animatePressOut = () => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {/* Notifications Setting */}
      <Animated.View
        style={[styles.settingItem, { transform: [{ scale: scaleValue }] }]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPressIn={animatePressIn}
          onPressOut={animatePressOut}
          style={styles.touchableContainer}
        >
          <View style={styles.settingLabel}>
            <Icon name="notifications-outline" size={22} color="#1E90FF" />
            <Text style={styles.settingText}>Enable Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={(value) => setNotifications(value)}
            trackColor={{ false: "#ccc", true: "#1E90FF" }}
            thumbColor={notifications ? "#007BFF" : "#f4f3f4"}
          />
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.separator} />

      {/* Account Options */}
      <Animated.View
        style={[styles.settingItem, { transform: [{ scale: scaleValue }] }]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPressIn={animatePressIn}
          onPressOut={animatePressOut}
          style={styles.touchableContainer}
        >
          <View style={styles.settingLabel}>
            <Icon name="person-circle-outline" size={22} color="#1E90FF" />
            <Text style={styles.settingText}>Edit Profile</Text>
          </View>
          <Icon name="chevron-forward-outline" size={20} color="#ccc" />
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.separator} />

      <Animated.View
        style={[styles.settingItem, { transform: [{ scale: scaleValue }] }]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPressIn={animatePressIn}
          onPressOut={animatePressOut}
          style={styles.touchableContainer}
        >
          <View style={styles.settingLabel}>
            <Icon name="lock-closed-outline" size={22} color="#1E90FF" />
            <Text style={styles.settingText}>Change Password</Text>
          </View>
          <Icon name="chevron-forward-outline" size={20} color="#ccc" />
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.separator} />

      {/* Logout Option */}
      <Animated.View
        style={[styles.settingItem, { transform: [{ scale: scaleValue }] }]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPressIn={animatePressIn}
          onPressOut={animatePressOut}
          style={styles.touchableContainer}
        >
          <View style={styles.settingLabel}>
            <Icon name="log-out-outline" size={22} color="#FF6347" />
            <Text style={[styles.settingText, styles.logoutText]}>Logout</Text>
          </View>
          <Icon name="chevron-forward-outline" size={20} color="#ccc" />
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
};

export default SettingsScreen;
