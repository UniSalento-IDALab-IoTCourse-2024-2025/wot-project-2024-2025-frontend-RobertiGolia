import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import Header from "../../components/Header";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RideBooked() {

  type Ride = {
    id: string;
    addA: string;
    addB: string;
    idUser: string;
    idAutista: string;
  };
  const [corseUtente, setCorseUtente] = useState<Ride[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [error, setError] = useState('');
  const invokeURL = 'https://nci92kc6ri.execute-api.us-east-1.amazonaws.com/dev';

  const handleCorseByIdUser = async () => {
    try {
      const userId = await AsyncStorage.getItem('idUsr');
      console.log(userId)
      if (!userId) return setError("Utente non identificato.");

      const response = await fetch(`${invokeURL}/api/trip/corseByIdUser/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.log('HTTP status:', response.status);
        setError('Errore nel recupero delle corse');
        return;
      }

      const data = await response.json();
      const { usersList } = data;

      if (Array.isArray(usersList)) {
        setCorseUtente(usersList);
      } else {
        setError("Nessuna corsa trovata.");
      }
    } catch (err) {
      console.error("Errore durante il recupero delle corse:", err);
      setError("Errore di rete");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        const name = await AsyncStorage.getItem("nome");
        setUserName(name);
        await handleCorseByIdUser();
      };
      loadData();
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

        <Text className="text-xl text-secondary mb-6">
          Se vuoi prenotare una corsa basta chiedere al chatbot! ✨
        </Text>
        <Text className="text-xl font-bold text-secondary mb-6">
          Le tue corse prenotate
        </Text>

        {corseUtente.length > 0 ? (
          <ScrollView className="flex-1">
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
              <View>
                {/* Header tabella */}
                <View className="border-b-2 border-secondary mb-2">
                  <View className="flex-row py-4">
                    {["Autista", "Data", "Partenza", "Destinazione"].map((col) => (
                      <React.Fragment key={col}>
                        <View style={{ width: col === "Partenza" || col === "Destinazione" ? 150 : 120 }} className="px-2">
                          <Text className="font-bold text-secondary text-center">{col}</Text>
                        </View>
                        <View className="w-[1] bg-gray-300" />
                      </React.Fragment>
                    ))}
                  </View>
                </View>

                {/* Righe */}
                {corseUtente.map((ride, index) => (
                  <View key={ride.id || index} className="border-b border-gray-200">
                    <View className="flex-row py-4">
                      <View style={{ width: 120 }} className="px-2">
                        <Text className="text-secondary text-center">{ride.idAutista || "N/D"}</Text>
                      </View>
                      <View className="w-[1] bg-gray-200" />
                      <View style={{ width: 120 }} className="px-2">
                        <Text className="text-secondary text-center">25/06/2025</Text> {/* Da sostituire con data reale */}
                      </View>
                      <View className="w-[1] bg-gray-200" />
                      <View style={{ width: 150 }} className="px-2">
                        <Text className="text-secondary text-center">{ride.addA}</Text>
                      </View>
                      <View className="w-[1] bg-gray-200" />
                      <View style={{ width: 150 }} className="px-2">
                        <Text className="text-secondary text-center">{ride.addB}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </ScrollView>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-lg text-red-500">{error || "Nessuna corsa prenotata."}</Text>
          </View>
        )}
      </View>
    </View>
  );
}
