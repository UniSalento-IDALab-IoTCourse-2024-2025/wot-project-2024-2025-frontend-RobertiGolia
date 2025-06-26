import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, RefreshControl } from "react-native";
import Header from "../../components/Header";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RideBooked() {

  type Ride = {
    id: string;
    addA: string;
    addB: string;
    idUser: string;
    idAutista: string;
    usernameAutista: string
    partito: boolean
  };
  const [corseUtente, setCorseUtente] = useState<Ride[]>([]);
  const [usernameAutista, setUserNameAutista] = useState<string[]>([])
  const [userName, setUserName] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [tempDate, setTempDate] = useState<string[]>([])
  const [refreshing, setRefreshing] = useState(false);
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

        // Dopo aver impostato le corse, recupera gli username
        const tempUsernames: string[] = [];

        for (let i = 0; i < usersList.length; i++) {
          const ride = usersList[i];
          const getUsernameAutista = await fetch(`${invokeURL}/users/${ride.idAutista}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!getUsernameAutista.ok) {
            console.log('Errore nel recupero username autista:', getUsernameAutista.status);
            tempUsernames.push("N/D");
            continue;
          }

          const info = await getUsernameAutista.json();
          const { username } = info;
          const { data } = info
          tempDate.push(data || "N/D")
          tempUsernames.push(username || "N/D");
        }

        setUserNameAutista(tempUsernames);
      } else {
        setError("Nessuna corsa trovata.");
      }

    } catch (err) {
      console.error("Errore durante il recupero delle corse:", err);
      setError("Errore di rete");
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await handleCorseByIdUser();
    setRefreshing(false);
  }, []);

  const handleStart = async (index : number) => {
    try {
      const userId = await AsyncStorage.getItem('idUsr');
      console.log(userId)
      if (!userId) return setError("Utente non identificato.");

      const response = await fetch(invokeURL + "/api/trip/parti/" + corseUtente[index].id, {
        method: 'PUT',
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
      const { message } = data;
      Alert.alert("Risposta", message)

    } catch (err) {
      console.error("Errore durante il recupero delle corse:", err);
      setError("Errore di rete");
    }
  }

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
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16, paddingTop: 32, paddingBottom: 32 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View>
              {/* Header tabella */}
              <View className="border-b-2 border-secondary mb-2">
                <View className="flex-row py-4">
                  {["Autista", "Parti", "Data", "Partenza", "Destinazione"].map((col) => (
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
                      <Text className="text-secondary text-center">{usernameAutista[index] || "N/D"}</Text>
                    </View>
                    <View className="w-[1] bg-gray-200" />
                    <View style={{ width: 100 }} className="px-2 items-center justify-center">
                      {!ride.partito ? (
                        <TouchableOpacity
                          onPress={() => {
                            handleStart(index);
                            router.replace('/scan');
                          }}
                          style={{
                            backgroundColor: "#22c55e",
                            paddingVertical: 6,
                            paddingHorizontal: 12,
                            borderRadius: 8,
                          }}
                        >
                          <Text style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>
                            Parti
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <Text style={{ color: "#9ca3af", fontWeight: "bold", textAlign: "center" }}>
                          In Corso
                        </Text>
                      )}

                    </View>
                    <View className="w-[1] bg-gray-200" />
                    <View style={{ width: 120 }} className="px-2">
                      <Text className="text-secondary text-center">{tempDate[index]}</Text>
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
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-lg text-red-500">{error || "Nessuna corsa prenotata."}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
