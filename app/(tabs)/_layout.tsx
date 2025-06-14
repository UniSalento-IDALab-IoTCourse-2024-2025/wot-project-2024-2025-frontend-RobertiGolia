import { Stack, Tabs } from 'expo-router';
import React from 'react';
import { Image, Pressable } from 'react-native';

const ACCENT_COLOR = "#0073ff";
const ACCENT_COLOR_20 = "#0073ff20";

const _Layout = () => {
  return (
    <>
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
      <Tabs
        screenOptions={{
          headerShown: false,
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
          tabBarShowLabel: false,
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
            title: "Home",
            tabBarIcon: ({ focused }) => (
              <Image
                source={require("../../assets/icons/home.png")}
                style={{
                  width: 24,
                  height: 24,
                  opacity: focused ? 1 : 0.5,
                  tintColor: focused ? ACCENT_COLOR : "#9CA4AB",
                }}
              />
            ),
          }}
        />

        <Tabs.Screen 
          name="chatbot" 
          options={{
            title: "Chatbot",
            tabBarIcon: ({ focused }) => (
              <Image
                source={require("../../assets/icons/chatbot.png")}
                style={{
                  width: 24,
                  height: 24,
                  opacity: focused ? 1 : 0.5,
                  tintColor: focused ? ACCENT_COLOR : "#9CA4AB",
                }}
              />
            ),
          }}
        />

        <Tabs.Screen 
          name="profile" 
          options={{
            title: "Profile",
            tabBarIcon: ({ focused }) => (
              <Image
                source={require("../../assets/icons/person2.png")}
                style={{
                  width: 24,
                  height: 24,
                  opacity: focused ? 1 : 0.5,
                  tintColor: focused ? ACCENT_COLOR : "#9CA4AB",
                }}
              />
            ),
          }}
        />

        <Tabs.Screen 
          name="about" 
          options={{
            title: "About",
            tabBarIcon: ({ focused }) => (
              <Image
                source={require("../../assets/icons/info.png")}
                style={{
                  width: 24,
                  height: 24,
                  opacity: focused ? 1 : 0.5,
                  tintColor: focused ? ACCENT_COLOR : "#9CA4AB",
                }}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
export default _Layout

