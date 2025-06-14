import { MaterialIcons } from '@expo/vector-icons';
import { Stack, Tabs } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';

const ACCENT_COLOR = "#0073ff";
const ACCENT_COLOR_20 = "#0073ff20";

export default function DriverTabLayout() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: ACCENT_COLOR,
          tabBarInactiveTintColor: "#9CA4AB",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "white",
            borderTopWidth: 1,
            borderTopColor: "#f0f0f0",
            height: 85,
            paddingBottom: 20,
            paddingTop: 1,
            shadowOpacity: 0.1,
          },
          tabBarActiveBackgroundColor: ACCENT_COLOR,
          tabBarInactiveBackgroundColor: "#9CA4AB",
          tabBarItemStyle: {
            paddingVertical: 7,
          },
          tabBarButton: (props) => {
            const { children, onPress, accessibilityState } = props;
            const focused = accessibilityState?.selected;

            return (
              <Pressable
                onPress={onPress}
                style={{
                  flex: 1,
                  backgroundColor: focused ? ACCENT_COLOR_20 : "transparent",
                  borderRadius: 12,
                  margin: 4,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {children}
              </Pressable>
            );
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused }) => (
              <MaterialIcons 
                name="home" 
                size={24} 
                color={focused ? ACCENT_COLOR : "#9CA4AB"}
                style={{ opacity: focused ? 1 : 0.5 }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profilo',
            tabBarIcon: ({ focused }) => (
              <MaterialIcons 
                name="person" 
                size={24} 
                color={focused ? ACCENT_COLOR : "#9CA4AB"}
                style={{ opacity: focused ? 1 : 0.5 }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="about"
          options={{
            title: 'About',
            tabBarIcon: ({ focused }) => (
              <MaterialIcons 
                name="info" 
                size={24} 
                color={focused ? ACCENT_COLOR : "#9CA4AB"}
                style={{ opacity: focused ? 1 : 0.5 }}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
} 