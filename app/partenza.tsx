import { Text, View, TouchableOpacity, Alert } from "react-native";
import Header from "@/components/Header";
import React, { use, useState } from "react";
import { Stack, useRouter } from 'expo-router';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import "react-native-get-random-values";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Partenza() {
  const router = useRouter();
  const [addA, setAddA] = useState('')
  const [addB, setAddB] = useState('')


  const [error, setError] = useState('')


  const invokeURL = 'https://nci92kc6ri.execute-api.us-east-1.amazonaws.com/dev';

  const handlePrenota = async () => {
    if (!addA || !addB) {
      Alert.alert("Errore", "Seleziona partenza e arrivo", [{ text: "OK" }]);
      return;
    }
  
    try {
      const idAutista = await AsyncStorage.getItem('idAutistaUsato');
      if (!idAutista) {
        setError("ID Autista mancante");
        return;
      }
  
      const takeSeat = await fetch(`${invokeURL}/users/takeSeat/${idAutista}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!takeSeat.ok) {
        console.log('Errore takeSeat:', takeSeat.status);
        setError('Errore nella prenotazione del posto');
        return;
      }
  
      const takeSeatResult = await takeSeat.json();
      
  
      if (takeSeatResult.result !== 4) {
        Alert.alert("Errore", takeSeatResult.message || "Posto non disponibile");
        return;
      }
  
      const token = await AsyncStorage.getItem('authToken');
      const tripDTO = {
        addA,
        addB,
      };
  
      const response = await fetch(`${invokeURL}/api/trip/reserve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'idAutista': idAutista
        },
        body: JSON.stringify(tripDTO)
      });
  
      if (!response.ok) {
        const errText = await response.text();
        console.log('Errore HTTP ' + response.status + ': ' + errText);
        setError('Registrazione fallita');
        return;
      }
  
      const risposta = await response.json();
      const { message } = risposta;

      //chiamata per incrementare il numero di corse effettuate
      const addCorsa = await fetch(invokeURL + "/users/addCorsa/" + idAutista, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (!addCorsa.ok) {
        const errText = await addCorsa.text();
        console.log('Errore HTTP ' + addCorsa.status + ': ' + errText);
        setError('Errore aggiunta corsa');
        return;
      }
      
  
      //const aggiungiCorsa = await addCorsa.json();
  
      Alert.alert("Prenotazione effettuata", message || "Viaggio prenotato", [
        {
          text: 'OK',
          onPress: () => router.push('/ride-booked')
        }
      ]);
    } catch (error) {
      console.error("Errore prenotazione:", error);
      Alert.alert('Errore', 'Errore di rete o del server');
    }
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
                key: 'AIzaSyCjggjjUtvpTPSr0nPMs-1jhTvcwwBmWqQ', // REPLACE WITH YOUR ACTUAL API KEY
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
                setAddA(data.description)
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
                  key: 'AIzaSyCjggjjUtvpTPSr0nPMs-1jhTvcwwBmWqQ', // REPLACE WITH YOUR ACTUAL API KEY
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
                  setAddB(data.description)
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
