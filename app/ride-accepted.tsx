import { Stack, useRouter } from "expo-router";
import React from 'react';
import { Text, TouchableOpacity, View } from "react-native";
import Header from "../components/Header";

export default function RideAccepted() {
  const router = useRouter();

  const handleTerminaCorsa = () => {
    // Per ora non fa niente, stampa solo al terminale
    console.log('Corsa terminata');
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      <Header />
      <View className="flex-1 p-6">
        <Text className="text-3xl font-bold text-secondary mb-8">Corsa accettata</Text>
        
        <TouchableOpacity
          onPress={handleTerminaCorsa}
          className="w-full bg-[#0073ff] py-4 rounded-xl items-center mt-6"
        >
          <Text className="text-white text-lg font-semibold">
            Termina corsa
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 