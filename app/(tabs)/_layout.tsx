import { Tabs } from "expo-router";
import { Image } from 'react-native';
import React from "react";

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen
                name="ride-booked"
                options={{
                    title: "Prenotate",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Image
                        source={require('../../assets/icons/home.png')}
                        style={{ width: size, height: size, tintColor: color }}
                        resizeMode="contain"
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="chatbot"
                options={{
                    title: "Chatbot",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Image
                            source={require('../../assets/icons/chatbot.png')}
                            style={{ width: size, height: size, tintColor: color }}
                            resizeMode="contain"
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profilo",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Image
                            source={require('../../assets/icons/person2.png')}
                            style={{ width: size, height: size, tintColor: color }}
                            resizeMode="contain"
                        />
                    ),
                }}
            />
            
            <Tabs.Screen
                name="about"
                options={{
                    title: "Chi siamo",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Image
                        source={require('../../assets/icons/info.png')}
                        style={{ width: size, height: size, tintColor: color }}
                        resizeMode="contain"
                        />
                    ),
                }}
            />
            
        </Tabs>
    );
}
