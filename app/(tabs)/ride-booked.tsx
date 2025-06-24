import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import Header from "../../components/Header";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const bookedRides = [
  {
    id: 1,
    autista: "mrossi",
    data: "25/06/2025",
    partenza: "lecce",
    destinazione: "brindisi",
  },
];

export default function RideBooked() {
  const [userName, setUserName] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      const getUserName = async () => {
        const name = await AsyncStorage.getItem("nome");
        setUserName(name);
      };
      getUserName();
    }, [])
  );

  return (
    <View className="flex-1 bg-white">
      <Header />
      <View className="flex-1 px-4 pt-8">
        {userName && (
          <Text className="text-3xl font-bold text-secondary text-center mb-2">
            Ciao {userName}
          </Text>
        )}

        <Text className="text-xl  text-secondary mb-6">
          Se vuoi prenotare una corsa basta chiedere al chatbot! ✨
        </Text>
        <Text className="text-xl font-bold text-secondary mb-6">
          Le tue corse prenotate
        </Text>

        

        {bookedRides.length > 0 ? (
          <ScrollView className="flex-1">
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
              <View>
                {/* Header della tabella */}
                <View className="border-b-2 border-secondary mb-2">
                  <View className="flex-row py-4">
                    <View style={{ width: 120 }} className="px-2">
                      <Text className="font-bold text-secondary text-center">
                        Autista
                      </Text>
                    </View>
                    <View className="w-[1] bg-gray-300" />
                    <View style={{ width: 120 }} className="px-2">
                      <Text className="font-bold text-secondary text-center">
                        Data
                      </Text>
                    </View>
                    <View className="w-[1] bg-gray-300" />
                    <View style={{ width: 150 }} className="px-2">
                      <Text className="font-bold text-secondary text-center">
                        Partenza
                      </Text>
                    </View>
                    <View className="w-[1] bg-gray-300" />
                    <View style={{ width: 150 }} className="px-2">
                      <Text className="font-bold text-secondary text-center">
                        Destinazione
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Righe della tabella */}
                {bookedRides.map((ride) => (
                  <View key={ride.id} className="border-b border-gray-200">
                    <View className="flex-row py-4">
                      <View style={{ width: 120 }} className="px-2">
                        <Text className="text-secondary text-center">
                          {ride.autista}
                        </Text>
                      </View>
                      <View className="w-[1] bg-gray-200" />
                      <View style={{ width: 120 }} className="px-2">
                        <Text className="text-secondary text-center">
                          {ride.data}
                        </Text>
                      </View>
                      <View className="w-[1] bg-gray-200" />
                      <View style={{ width: 150 }} className="px-2">
                        <Text className="text-secondary text-center">
                          {ride.partenza}
                        </Text>
                      </View>
                      <View className="w-[1] bg-gray-200" />
                      <View style={{ width: 150 }} className="px-2">
                        <Text className="text-secondary text-center">
                          {ride.destinazione}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </ScrollView>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-lg">Nessuna corsa prenotata.</Text>
          </View>
        )}
      </View>
    </View>
  );
} 