import { Text, View, TouchableOpacity, Alert } from "react-native";
import Header from "@/components/Header";
import React, {useState} from "react";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default function Partenza() {
  const [partenza, setPartenza] = useState("");
  const [arrivo, setArrivo] = useState("");

  const handlePrenota = () => {
    if (!partenza || !arrivo) {
      Alert.alert(
        "Errore",
        "Per favore, seleziona sia il punto di partenza che quello di arrivo",
        [{ text: "OK" }]
      );
      return;
    }

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
            <GooglePlacesAutocomplete
              placeholder="Inserisci la città di partenza"
              onPress={(data, details = null) => {
                setPartenza(data.description);
              }}
              query={{
                key: 'AIzaSyCjggjjUtvpTPSr0nPMs-1jhTvcwwBmWqQ',
                language: 'it',
                types: 'address'
              }}
              styles={{
                container: {
                  flex: 0,
                },
                textInput: {
                  height: 48,
                  backgroundColor: '#F3F4F6',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  fontSize: 16,
                },
                listView: {
                  backgroundColor: 'white',
                  borderRadius: 12,
                  marginTop: 4,
                  elevation: 3,
                  zIndex: 1000,
                },
                row: {
                  padding: 13,
                  height: 44,
                },
                description: {
                  fontSize: 14,
                },
              }}
            />
          </View>

          <View>
            <Text className="text-secondary mb-2 text-base">Arrivo</Text>
            <GooglePlacesAutocomplete
              placeholder="Inserisci la città di arrivo"
              onPress={(data, details = null) => {
                setArrivo(data.description);
              }}
              query={{
                key: 'AIzaSyCjggjjUtvpTPSr0nPMs-1jhTvcwwBmWqQ',
                language: 'it',
                types: 'address'
              }}
              styles={{
                container: {
                  flex: 0,
                },
                textInput: {
                  height: 48,
                  backgroundColor: '#F3F4F6',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  fontSize: 16,
                },
                listView: {
                  backgroundColor: 'white',
                  borderRadius: 12,
                  marginTop: 4,
                  elevation: 3,
                  zIndex: 1000,
                },
                row: {
                  padding: 13,
                  height: 44,
                },
                description: {
                  fontSize: 14,
                },
              }}
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