import { useState } from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import Header from "../../components/Header";

const corseStatiche = [
  { id: 1, partenza: "Milano", arrivo: "Torino", ora: "10:00" },
  { id: 2, partenza: "Roma", arrivo: "Napoli", ora: "11:30" },
  { id: 3, partenza: "Firenze", arrivo: "Bologna", ora: "12:15" },
  { id: 4, partenza: "Venezia", arrivo: "Padova", ora: "13:00" },
  { id: 5, partenza: "Genova", arrivo: "Pisa", ora: "14:45" },
];

export default function Home() {
  const [selectedRide, setSelectedRide] = useState<number | null>(null);

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
            {corseStatiche.map((corsa) => (
              <TouchableOpacity
                key={corsa.id}
                onPress={() => setSelectedRide(corsa.id)}
                className={`border-b border-gray-200 ${selectedRide === corsa.id ? "bg-[#0073ff20]" : ""}`}
              >
                <View className="flex-row py-4">
                  <View style={{ width: 80 }} className="px-2">
                    <Text className="text-secondary text-center">{corsa.ora}</Text>
                  </View>
                  <View className="w-[1] bg-gray-200" />
                  <View style={{ width: 120 }} className="px-2">
                    <Text className="text-secondary text-center">{corsa.partenza}</Text>
                  </View>
                  <View className="w-[1] bg-gray-200" />
                  <View style={{ width: 120 }} className="px-2">
                    <Text className="text-secondary text-center">{corsa.arrivo}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
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
        </View>
      </View>
    </View>
  );
} 