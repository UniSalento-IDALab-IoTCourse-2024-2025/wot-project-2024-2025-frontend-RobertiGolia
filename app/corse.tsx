import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Header from "../components/Header";
import { AVAILABLE_RIDES } from "../constants/mockData";

export default function Corse() {
  const router = useRouter();
  const [selectedRide, setSelectedRide] = useState<string | null>(null);

  return (
    <View className="flex-1 bg-white">
      <Header />
      <View className="flex-1 px-4 pt-8">
        <Text className="text-2xl font-bold text-secondary mb-6">
          Corse disponibili
        </Text>

        <ScrollView className="flex-1">
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View>
              {/* Header della tabella */}
              <View className="border-b-2 border-secondary mb-2">
                <View className="flex-row py-4">
                  <View style={{ width: 80 }} className="px-2">
                    <Text className="font-bold text-secondary text-center">Orario</Text>
                  </View>
                  <View className="w-[1] bg-gray-300" />
                  <View style={{ width: 150 }} className="px-2">
                    <Text className="font-bold text-secondary text-center">Autista</Text>
                  </View>
                  <View className="w-[1] bg-gray-300" />
                  <View style={{ width: 150 }} className="px-2">
                    <Text className="font-bold text-secondary text-center">Veicolo</Text>
                  </View>
                </View>
              </View>

              {/* Righe della tabella */}
              {AVAILABLE_RIDES.map((ride) => (
                <TouchableOpacity
                  key={ride.id}
                  onPress={() => setSelectedRide(ride.id)}
                  className={`border-b border-gray-200 ${
                    selectedRide === ride.id ? "bg-[#0073ff20]" : ""
                  }`}
                >
                  <View className="flex-row py-4">
                    <View style={{ width: 80 }} className="px-2">
                      <Text className="text-secondary text-center">
                        {ride.orario}
                      </Text>
                    </View>
                    <View className="w-[1] bg-gray-200" />
                    <View style={{ width: 150 }} className="px-2">
                      <Text className="text-secondary text-center">
                        {ride.autista}
                      </Text>
                    </View>
                    <View className="w-[1] bg-gray-200" />
                    <View style={{ width: 150 }} className="px-2">
                      <Text className="text-secondary text-center">
                        {ride.veicolo}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </ScrollView>

        <View className="py-6">
          <TouchableOpacity
            onPress={() => selectedRide && router.push('/scan')}
            className={`w-full py-4 rounded-xl items-center ${
              selectedRide ? "bg-[#0073ff]" : "bg-gray-300"
            }`}
            disabled={!selectedRide}
          >
            <Text className="text-white text-lg font-semibold">
              Prenota corsa
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
} 