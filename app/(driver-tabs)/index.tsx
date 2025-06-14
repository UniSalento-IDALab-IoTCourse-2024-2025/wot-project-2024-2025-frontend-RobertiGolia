import { useRouter } from "expo-router";
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Header from "../../components/Header";
import { rides } from "../../constants/rides";

export default function DriverHome() {
  const router = useRouter();

  const handleAccettaCorsa = (id: string) => {
    router.push('/ride-accepted');
  };

  return (
    <View className="flex-1 bg-white">
      <Header />
      <ScrollView className="flex-1 p-6">
        <Text className="text-3xl font-bold text-secondary mb-8">Lista corse prenotate</Text>
        
        <View className="space-y-4 gap-4">
          {rides.map((ride) => (
            <View key={ride.id} className="bg-gray-100 p-4 rounded-xl">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-secondary font-bold text-lg">{ride.orario}</Text>
                <TouchableOpacity
                  onPress={() => handleAccettaCorsa(ride.id)}
                  className="bg-[#0073ff] px-4 py-2 rounded-xl"
                >
                  <Text className="text-white font-semibold">
                    Accetta corsa
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View className="space-y-1">
                <Text className="text-secondary">
                  <Text className="font-semibold">Cliente: </Text>
                  {ride.nomeCliente}
                </Text>
                <Text className="text-secondary">
                  <Text className="font-semibold">Partenza: </Text>
                  {ride.puntoPartenza}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
} 