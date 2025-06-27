import { useState, useEffect, useCallback } from "react";
import { Text, View, ScrollView, TouchableOpacity, Alert, RefreshControl } from "react-native";
import Header from "../../components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from 'expo-location';

export default function Home() {
  const invokeURL = 'https://nci92kc6ri.execute-api.us-east-1.amazonaws.com/dev';
  const [selectedRide, setSelectedRide] = useState<number | null>(null);
  const [corse, setCorse] = useState<any[]>([]);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const handleCorse = async () => {
    try {
      const userId = await AsyncStorage.getItem('idUsr');
      const response = await fetch(`${invokeURL}/api/trip/corseByIdAutista/${userId}`);
      if (!response.ok) throw new Error(`Status ${response.status}`);
      const data = await response.json();
      const { tripsList } = data;
      if (Array.isArray(tripsList)) {
        setCorse(tripsList);
        setError('');
      } else {
        setError('Nessuna corsa trovata.');
      }
    } catch (err) {
      console.error("Errore durante il recupero delle corse:", err);
      setError("Errore di rete");
    }
  };

  const handleSendEmail = async (email: string) => {
    try {
      let posizione = "";
      if (latitude && longitude) {
        posizione = `\n\nCoordinate:\nLatitudine: ${latitude}\nLongitudine: ${longitude}\nhttps://maps.google.com/?q=${latitude},${longitude}`;
      }
      const emailDto = {
        email,
        subject: "Corsa finita",
        body: `Gentile utente,\n\nLa corsa è finita.${posizione}`
      };
      const response = await fetch(`${invokeURL}/api/trip/sendEmail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailDto),
      });
      if (!response.ok) throw new Error(`Errore invio email, status ${response.status}`);
      const data = await response.json();
      console.log("Email inviata:", data.message);
    } catch (err) {
      console.error("Errore durante l'invio dell'email:", err);
      setError("Errore durante l’invio dell’email");
    }
  };

  const handleFineCorsa = async (idCorsa: number) => {
    try {
      // Prendi info corsa
      const corsaRes = await fetch(`${invokeURL}/api/trip/${idCorsa}`);
      if (!corsaRes.ok) throw new Error(`Errore fetch corsa: ${corsaRes.status}`);
      const corsaInfo = await corsaRes.json();
      const trip = corsaInfo.trip;

      const id = trip.id;           // "685ebb96e808c5295e8c111c"
      const addA = trip.addA;       // "CBD, Melbourne Victoria, Australia"
      const addB = trip.addB;       // "Budapest, XVI. kerület, Ungheria"
      const idUser = trip.idUser;   // "685eb12fb34461547f78df42"
      const idAutista = trip.idAutista; // "685e68e1dbed2774a9433960"
      const partito = trip.partito; // false
      console.log(corsaInfo)
      // Prendi info utente
      const utenteRes = await fetch(`${invokeURL}/users/${idUser}`);
      if (!utenteRes.ok) throw new Error(`Errore fetch utente: ${utenteRes.status}`);

      const utenteInfo = await utenteRes.json();
      const { email_parente } = utenteInfo;
      console.log(email_parente)

      // Termina corsa
      const terminaRes = await fetch(`${invokeURL}/api/trip/termina_corsa/${idCorsa}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!terminaRes.ok) throw new Error(`Errore terminazione corsa: ${terminaRes.status}`);

      // Email
      await handleSendEmail(email_parente);

      Alert.alert("Corsa terminata");
      setSelectedRide(null);
      handleCorse();
    } catch (err) {
      console.error("Errore nella terminazione:", err);
      Alert.alert("Errore", "Qualcosa è andato storto durante la terminazione della corsa.");
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await handleCorse();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    handleCorse();
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permesso per la posizione negato');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    })();
  }, []);

  return (
    <View className="flex-1 bg-white">
      <Header />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16, paddingTop: 32, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text className="text-3xl font-bold text-secondary mb-8 text-center">Lista corse</Text>
        <View>
          <View className="border-b-2 border-secondary mb-2">
            <View className="flex-row py-4">
              <View style={{ width: 120 }} className="px-2">
                <Text className="font-bold text-secondary text-center">Partenza</Text>
              </View>
              <View className="w-[1] bg-gray-300" />
              <View style={{ width: 120 }} className="px-2">
                <Text className="font-bold text-secondary text-center">Arrivo</Text>
              </View>
            </View>
          </View>

          {corse.length > 0 ? (
            corse.map((corsa, index) => (
              <View
                key={corsa.id}
                className={`border-b border-gray-200 flex-row items-center ${selectedRide === index ? "bg-[#0073ff20]" : ""}`}
              >
                <TouchableOpacity onPress={() => setSelectedRide(index)} className="flex-1">
                  <View className="flex-row py-4">
                    <View style={{ width: 120 }} className="px-2">
                      <Text className="text-secondary text-center">{corsa.addA}</Text>
                    </View>
                    <View className="w-[1] bg-gray-200" />
                    <View style={{ width: 120 }} className="px-2">
                      <Text className="text-secondary text-center">{corsa.addB}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                {selectedRide === index && (
                  <View className="pr-2">
                    <TouchableOpacity onPress={() => handleFineCorsa(corsa.id)} className="bg-red-500 py-2 px-3 rounded-lg">
                      <Text className="text-white font-bold">Fine corsa</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))
          ) : (
            <Text className="text-red-500 text-center mt-4">{error || "Nessuna corsa disponibile"}</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
