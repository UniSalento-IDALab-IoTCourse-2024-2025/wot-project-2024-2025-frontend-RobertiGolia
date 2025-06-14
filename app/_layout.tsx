import { Stack } from "expo-router";
import React from 'react';
import { StatusBar, useColorScheme } from "react-native";
import './globals.css';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <StatusBar hidden={true} />
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="(auth)/login" 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="(auth)/registrazione" 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="(auth)/driver-login" 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="(auth)/driver-registration" 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="corse" 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="scan" 
          options={{ 
            headerShown: false,
            presentation: 'modal'
          }} 
        />
      </Stack>
    </>
  );
}