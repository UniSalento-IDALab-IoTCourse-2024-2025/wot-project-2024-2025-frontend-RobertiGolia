import { Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import Header from "@/components/Header";
import { useState } from "react";

export default function Partenza() {
  const [partenza, setPartenza] = useState("");
  const [arrivo, setArrivo] = useState("");

  const handlePrenota = () => {
    Alert.alert(
      "Prenotazione",
      "Prenotazione effettuata",
      [{ text: "OK" }]
    );
  };

  return (
    <View className="flex-1 bg-white">
      <Header />
      <View className="flex-1 p-6">
        <Text className="text-3xl font-bold text-secondary mb-8 text-center">
          Prenota il tuo viaggio
        </Text>

        <View className="space-y-4">
          <View>
            <Text className="text-secondary mb-2 text-base">Partenza</Text>
            <TextInput
              className="w-full bg-gray-100 rounded-xl px-4 py-3"
              placeholder="Inserisci la città di partenza"
              value={partenza}
              onChangeText={setPartenza}
            />
          </View>

          <View>
            <Text className="text-secondary mb-2 text-base">Arrivo</Text>
            <TextInput
              className="w-full bg-gray-100 rounded-xl px-4 py-3"
              placeholder="Inserisci la città di arrivo"
              value={arrivo}
              onChangeText={setArrivo}
            />
          </View>

          <TouchableOpacity 
            onPress={handlePrenota}
            className="w-full bg-[#0073ff] py-4 rounded-xl items-center mt-8"
          >
            <Text className="text-white text-lg font-semibold">
              Prenota
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
} 