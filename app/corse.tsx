import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View, Alert } from "react-native";
import Header from "../components/Header";
import { AVAILABLE_RIDES } from "../constants/mockData";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Corse() {
  const router = useRouter();
  const [selectedRide, setSelectedRide] = useState<string | null>(null);
  const [addA, setAddA] = useState('')
  const [addB, setAddB] = useState('')
  const [error, setError] = useState('')
  const invokeURL = 'https://nci92kc6ri.execute-api.us-east-1.amazonaws.com/dev';

  const handleCorseByIdUser = async () => {

    try {

      const getAutista = await fetch(invokeURL + "/api/trip/corseByIdUser/" + await AsyncStorage.getItem('idUsr'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await getAutista.json()

      const { addA } = data
      const { addB } = data
      setAddA(addA)
      setAddB(addB)
    } catch (error) {
      console.error("Errore durante la registrazione:", error);
      Alert.alert('Errore', 'Errore di rete o del server');
    }

  };

  useEffect(() => {
    handleCorseByIdUser();
  }, []);
  return (
    <View className="flex-1 bg-white">
      <Header />
      <View className="flex-1 px-4 pt-8">
        <Text className="text-2xl font-bold text-secondary mb-6">
          Corse disponibili
        </Text>
        {(addA || addB) && (
          <View className="mb-4">
            <Text className="text-base text-secondary">Partenza: {addA}</Text>
            <Text className="text-base text-secondary">Destinazione: {addB}</Text>
          </View>
        )}

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
                  className={`border-b border-gray-200 ${selectedRide === ride.id ? "bg-[#0073ff20]" : ""
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

      </View>
    </View>
  );
} 