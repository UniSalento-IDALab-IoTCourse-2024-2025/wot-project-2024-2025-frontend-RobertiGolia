import { Text, View, TouchableOpacity, Alert } from "react-native";
import Header from "@/components/Header";
import React, { useState } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import "react-native-get-random-values";


export default function Partenza() {
  const [partenza, setPartenza] = useState('');
  const [arrivo, setArrivo] = useState('');
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
      "Prenotazione effettuata da " + partenza + " a " + arrivo,
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
          <View style={{ marginBottom: 16, paddingVertical: 20 }}>
            <Text className="text-secondary mb-2 text-base">Partenza</Text>
            <GooglePlacesAutocomplete
              // Required props
              placeholder="Partenza"
              query={{
                key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY, // REPLACE WITH YOUR ACTUAL API KEY
                language: 'it',
                types: 'geocode',
              }}
              // All other default props explicitly defined
              autoFillOnNotFound={false}
              currentLocation={false}

              currentLocationLabel="Current location"
              debounce={0}
              disableScroll={false}
              enableHighAccuracyLocation={true}
              enablePoweredByContainer={true}
              fetchDetails={true}
              filterReverseGeocodingByTypes={[]}

              GooglePlacesSearchQuery={{
                rankby: 'distance'
              }}
              GoogleReverseGeocodingQuery={{}}
              isRowScrollable={true}
              keyboardShouldPersistTaps="always"
              listUnderlayColor="#c8c7cc"
              listViewDisplayed="auto"
              keepResultsAfterBlur={false}
              minLength={1}
              nearbyPlacesAPI="GooglePlacesSearch"
              numberOfLines={1}
              onFail={() => { }}
              onNotFound={() => { }}
              onPress={(data, details = null) => {
                // Handle selection
                setPartenza(data.description)
              }}
              onTimeout={() =>
                console.warn('google places autocomplete: request timeout')
              }
              predefinedPlaces={[]}
              predefinedPlacesAlwaysVisible={false}
              //suppressDefaultStyles={false}
              //textInputHide={false}

              textInputProps={{
                placeholderTextColor: "#888",
                style: {
                  backgroundColor: "#f9f9f9",
                  borderColor: "#ccc",
                  borderWidth: 1,
                  paddingHorizontal: 12,
                  paddingVertical: 20,
                  borderRadius: 10,
                  fontSize: 16,
                  color: "#000",
                  width: "100%",
                }
              }}

              timeout={20000}
              styles={{
                listView: {
                  position: 'absolute',
                  top: 60,
                  zIndex: 9999,
                  backgroundColor: 'white',
                },
                container: {
                  flex: 0,
                },
                textInput: {
                  backgroundColor: "#f9f9f9",
                  borderColor: "#ccc",
                  borderWidth: 1,
                  paddingHorizontal: 12,
                  paddingVertical: 20,
                  borderRadius: 10,
                  fontSize: 16,
                  color: "#000",
                },
              }}
            />
          </View>

          <View className="space-y-4">
            <View style={{ marginBottom: 16, paddingVertical: 20 }}>
              <Text className="text-secondary mb-2 text-base">Arrivo</Text>
              <GooglePlacesAutocomplete
                // Required props
                placeholder="Arrivo"
                query={{
                  key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY, // REPLACE WITH YOUR ACTUAL API KEY
                  language: 'it',
                  types: 'geocode',
                }}
                // All other default props explicitly defined
                autoFillOnNotFound={false}
                currentLocation={false}
                currentLocationLabel="Current location"
                debounce={0}
                disableScroll={false}
                enableHighAccuracyLocation={true}
                enablePoweredByContainer={true}
                fetchDetails={false}
                filterReverseGeocodingByTypes={[]}
                GooglePlacesDetailsQuery={{}}

                GoogleReverseGeocodingQuery={{}}
                isRowScrollable={true}
                keyboardShouldPersistTaps="always"
                listUnderlayColor="#c8c7cc"
                listViewDisplayed="auto"
                keepResultsAfterBlur={false}
                minLength={1}
                nearbyPlacesAPI="GooglePlacesSearch"
                numberOfLines={1}
                onFail={() => { }}
                onNotFound={() => { }}
                onPress={(data, details = null) => {
                  // Handle selection
                  setArrivo(data.description)
                }}
                onTimeout={() =>
                  console.warn('google places autocomplete: request timeout')
                }
                predefinedPlaces={[]}
                predefinedPlacesAlwaysVisible={false}
                
                suppressDefaultStyles={false}
                textInputHide={false}

                textInputProps={{
                  placeholderTextColor: "#888",
                  style: {
                    backgroundColor: "#f9f9f9",
                    borderColor: "#ccc",
                    borderWidth: 1,
                    paddingHorizontal: 12,
                    paddingVertical: 20,
                    borderRadius: 10,
                    fontSize: 16,
                    color: "#000",
                    width: "100%",
                  },
                }}

                timeout={5000}
                styles={{
                  listView: {
                    position: 'absolute',
                    top: 60,
                    zIndex: 9999,
                    backgroundColor: 'white',
                  },
                  container: {
                    flex: 0,
                  },
                  textInput: {
                    backgroundColor: "#f9f9f9",
                    borderColor: "#ccc",
                    borderWidth: 1,
                    paddingHorizontal: 12,
                    paddingVertical: 20,
                    borderRadius: 10,
                    fontSize: 16,
                    color: "#000",
                  },
                }}
              />
            </View>

            <TouchableOpacity
              onPress={handlePrenota}
              className="w-full bg-[#0073ff] py-4 rounded-xl items-center mt-8"
            >
              <Text className="text-white text-lg font-semibold">Prenota</Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>
    </View>
  );
}
