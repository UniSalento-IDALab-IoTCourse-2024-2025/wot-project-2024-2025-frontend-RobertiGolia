import { useState, useEffect } from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import Header from "../../components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";



export default function Home() {
  const invokeURL = 'https://nci92kc6ri.execute-api.us-east-1.amazonaws.com/dev'
  const [selectedRide, setSelectedRide] = useState<number | null>(null);
  const [addA, setAddA] = useState<string[]>([])
  const [addB, setAddB] = useState<string[]>([])
  const [corse, setCorse] = useState<any[]>([]);

  const [error, setError] = useState('')

  const corseStatiche = [
    { id: 1, partenza: "Milano", arrivo: "Torino", ora: "10:00" },
    { id: 2, partenza: "Roma", arrivo: "Napoli", ora: "11:30" },
    { id: 3, partenza: "Firenze", arrivo: "Bologna", ora: "12:15" },
    { id: 4, partenza: "Venezia", arrivo: "Padova", ora: "13:00" },
    { id: 5, partenza: "Genova", arrivo: "Pisa", ora: "14:45" },
  ];

  const handleCorse = async () => {
    try {
      const userId = await AsyncStorage.getItem('idUsr');
      const response = await fetch(invokeURL + "/api/trip/corseByIdAutista/" + userId, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.log('ricevuto HTTP status ' + response.status);
        setError('Errore nel recupero delle corse');
        return;
      }

      const data = await response.json();
      const { usersList } = data;


      if (Array.isArray(usersList)) {
        setCorse(usersList);
      } else {
        setError('Nessuna corsa trovata.');
      }
    } catch (error) {
      console.error("Errore durante il recupero delle corse:", error);
      setError("Errore di rete");
    }
  };

  useEffect(() => {
    handleCorse();
  }, []);


  return (
    <View className="flex-1 bg-white">
      <Header />
      <View className="flex-1 p-6">
        <Text className="text-3xl font-bold text-secondary mb-8 text-center">
          Lista corse
        </Text>
        <ScrollView className="flex-1">
          <View>
            {/* Header della tabella */}
            <View className="border-b-2 border-secondary mb-2">
              <View className="flex-row py-4">
                <View style={{ width: 80 }} className="px-2">
                  <Text className="font-bold text-secondary text-center">Orario</Text>
                </View>
                <View className="w-[1] bg-gray-300" />
                <View style={{ width: 120 }} className="px-2">
                  <Text className="font-bold text-secondary text-center">Partenza</Text>
                </View>
                <View className="w-[1] bg-gray-300" />
                <View style={{ width: 120 }} className="px-2">
                  <Text className="font-bold text-secondary text-center">Arrivo</Text>
                </View>
              </View>
            </View>

            {/* Righe della tabella */}
            {corse.length > 0 ? (
              corse.map((corsa, index) => (
                <TouchableOpacity
                  key={corsa.id}
                  onPress={() => setSelectedRide(index)}
                  className={`border-b border-gray-200 ${selectedRide === index ? "bg-[#0073ff20]" : ""}`}
                >
                  <View className="flex-row py-4">
                    <View style={{ width: 80 }} className="px-2">
                      <Text className="text-secondary text-center">-</Text>
                    </View>
                    <View className="w-[1] bg-gray-200" />
                    <View style={{ width: 120 }} className="px-2">
                      <Text className="text-secondary text-center">{corsa.addA}</Text>
                    </View>
                    <View className="w-[1] bg-gray-200" />
                    <View style={{ width: 120 }} className="px-2">
                      <Text className="text-secondary text-center">{corsa.addB}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text className="text-red-500 text-center mt-4">
                {error || "Nessuna corsa disponibile"}
              </Text>
            )}


          </View>
        </ScrollView>
        {/*
        <View className="py-6">
          <TouchableOpacity
            onPress={() => selectedRide && console.log('Corsa accettata:', selectedRide)}
            className={`w-full py-4 rounded-xl items-center ${selectedRide ? "bg-[#0073ff]" : "bg-gray-300"}`}
            disabled={!selectedRide}
          >
            <Text className="text-white text-lg font-semibold">
              Accetta corsa
            </Text>
          </TouchableOpacity>
        </View>*/}
      </View>
    </View>
  );
} 