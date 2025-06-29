import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import Header from "../components/Header";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import { clearCurrentUser, getCurrentUser } from "../constants/currentUser";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get("window").width;

export default function Dashboard() {

  const router = useRouter();
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
  const [autistiChartLabels, setAutistiChartLabels] = useState<string[]>([]);
  const [autistiChartData, setAutistiChartData] = useState<number[]>([]);
  const invokeURL = 'https://nci92kc6ri.execute-api.us-east-1.amazonaws.com/dev';

  const handleGetAll = async () => {
    try {
      const userId = await AsyncStorage.getItem('idUsr');
      const getUser = await fetch(invokeURL+"/users/" + userId, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!getUser.ok) {
        console.log('HTTP status:', getUser.status);
        setError('Errore nel recupero delle corse');
        return;
      }
      console.log(getUser)
      const dataUser = await getUser.json();
      const { username } = dataUser; 
      console.log(username)
      const storedUserName = await AsyncStorage.getItem('username');
      setUserName(username);

      if (!userId) return setError("Utente non identificato.");

      const response = await fetch(`${invokeURL}/api/trip/corse`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        console.log('HTTP status:', response.status);
        setError('Errore nel recupero delle corse');
        return;
      }

      const data = await response.json();
      const { tripsList } = data;

      if (!Array.isArray(tripsList)) return setError("Nessuna corsa trovata.");
      setCorseUtente(tripsList);

      // Chiamata corretta per recuperare tutti gli utenti
      const getAll = await fetch(`${invokeURL}/users`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!getAll.ok) {
        console.log('HTTP status:', getAll.status);
        setError('Errore nel recupero degli utenti');
        return;
      }

      const tutti = await getAll.json();
      const { usersList } = tutti;

      // Prepara username e date autisti
      const fetches = tripsList.map((ride) =>
        fetch(`${invokeURL}/api/users/${ride.idAutista}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
          .then((res) => res.ok ? res.json() : null)
          .then((info) => ({
            username: info?.username || "N/D",
            data: info?.data || "N/D"
          }))
          .catch(() => ({
            username: "N/D",
            data: "N/D"
          }))
      );

      const results = await Promise.all(fetches);
      const usernames = results.map((r) => r.username);
      const dates = results.map((r) => r.data);

      setUserNameAutista(usernames);
      setTempDate(dates);

      // Calcolo corse per autista
      const autisti = usersList.filter((user: any) => user.ruolo === 'autista');
      const corsePerAutista: { [username: string]: number } = {};

      autisti.forEach((autista: any) => {
        const count = tripsList.filter((trip) => trip.idAutista === autista.id).length;
        corsePerAutista[autista.username] = count;
      });

      const labels = Object.keys(corsePerAutista).map((username) =>
        username.length > 8 ? username.slice(0, 6) + "…" : username
      );

      const values = Object.values(corsePerAutista);

      setAutistiChartLabels(labels);
      setAutistiChartData(values);

    } catch (err) {
      console.error("Errore durante il recupero delle corse:", err);
      setError("Errore di rete");
    }
  };



  const handleLogout = async () => {
    clearCurrentUser();
    // Forziamo un reload completo dell'app
    try {
      //await Updates.reloadAsync();
      AsyncStorage.removeItem('nome')
      AsyncStorage.removeItem('ruolo')
      AsyncStorage.removeItem('idUsr')
      AsyncStorage.removeItem('email')
      AsyncStorage.removeItem('data_nascita')
      AsyncStorage.removeItem('username')
      AsyncStorage.removeItem('cognome')
      router.replace('/(auth)/login')
    } catch (error) {
      console.log(error)

    }
  };
  useEffect(() => {
    handleGetAll();
  }, []);

  
  return (
    <View className="flex-1 bg-white">
      <Header />
      <ScrollView className="flex-1 p-6">
        <Text className="text-3xl font-bold text-secondary mb-8">Pannello di controllo</Text>
        {/* Lista corse prenotate */}
        <View className="mb-8 bg-gray-100 p-4 rounded-xl">
          <Text className="text-lg font-semibold text-secondary mb-2">Corse prenotate</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View>
              {/* Header della tabella */}
              <View className="border-b-2" style={{ borderBottomColor: '#0073ff' }}>
                <View className="flex-row py-2">
                  <View style={{ width: 120 }} className="px-2">
                    <Text className="font-bold text-secondary text-center">Cliente</Text>
                  </View>
                  <View style={{ width: 1, backgroundColor: '#0073ff' }} />
                  <View style={{ width: 120 }} className="px-2">
                    <Text className="font-bold text-secondary text-center">Autista</Text>
                  </View>
                  <View style={{ width: 1, backgroundColor: '#0073ff' }} />
                  <View style={{ width: 100 }} className="px-2">
                    <Text className="font-bold text-secondary text-center">Data</Text>
                  </View>
                  <View style={{ width: 1, backgroundColor: '#0073ff' }} />
                  <View style={{ width: 120 }} className="px-2">
                    <Text className="font-bold text-secondary text-center">Partenza</Text>
                  </View>
                  <View style={{ width: 1, backgroundColor: '#0073ff' }} />
                  <View style={{ width: 120 }} className="px-2">
                    <Text className="font-bold text-secondary text-center">Destinazione</Text>
                  </View>
                </View>
              </View>
              {/* Righe di esempio scrollabili verticalmente, massimo 4 visibili */}
              <ScrollView style={{ maxHeight: 4 * 44 }} showsVerticalScrollIndicator={true}>
                {corseUtente.map((corsa, idx) => (

                  <View key={corsa.id || idx} className="flex-row py-2 bg-white/60" style={{ borderBottomWidth: idx < corseUtente.length - 1 ? 1 : 0, borderBottomColor: '#0073ff' }}>
                    <View style={{ width: 120 }} className="px-2 justify-center items-center">
                      <Text className="text-secondary text-center">{userName ?? "Cliente"}</Text>
                    </View>
                    <View style={{ width: 1, backgroundColor: '#0073ff' }} />
                    <View style={{ width: 120 }} className="px-2 justify-center items-center">
                      <Text className="text-secondary text-center">{usernameAutista[idx] ?? "N/D"}</Text>
                    </View>
                    <View style={{ width: 1, backgroundColor: '#0073ff' }} />
                    <View style={{ width: 100 }} className="px-2 justify-center items-center">
                      <Text className="text-secondary text-center">{tempDate[idx] ?? "N/D"}</Text>
                    </View>
                    <View style={{ width: 1, backgroundColor: '#0073ff' }} />
                    <View style={{ width: 120 }} className="px-2 justify-center items-center">
                      <Text className="text-secondary text-center">{corsa.addA}</Text>
                    </View>
                    <View style={{ width: 1, backgroundColor: '#0073ff' }} />
                    <View style={{ width: 120 }} className="px-2 justify-center items-center">
                      <Text className="text-secondary text-center">{corsa.addB}</Text>
                    </View>
                  </View>
                ))}


              </ScrollView>
            </View>
          </ScrollView>
        </View>


        {/* Grafico 2: LineChart */}
        <View className="mb-8 bg-gray-100 p-4 rounded-xl">
          <Text className="text-lg font-semibold text-secondary mb-2">Corse per autista</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BarChart
              data={{
                labels: autistiChartLabels,
                datasets: [
                  {
                    data: autistiChartData,
                    color: () => "#0073ff",
                  },
                ],
              }}
              width={autistiChartLabels.length * 60} // 60px per barra
              height={260}
              yAxisLabel={""}
              yAxisSuffix={""}
              withHorizontalLabels={true}
              fromZero={true}
              yAxisInterval={1}
              chartConfig={{
                backgroundColor: "#f3f4f6",
                backgroundGradientFrom: "#f3f4f6",
                backgroundGradientTo: "#f3f4f6",
                decimalPlaces: 0,
                color: () => "#0073ff",
                labelColor: () => "#64748b",
                propsForBackgroundLines: {
                  strokeDasharray: "4",
                  stroke: "#0073ff",
                },
                propsForLabels: {
                  fontSize: 11,
                  rotation: 30, // effetto visivo simulato
                  fill: "#64748b",
                },
              }}
              style={{ borderRadius: 16, paddingRight: 50, paddingLeft: 20 }}
            />
          </ScrollView>
        </View>

        {/* Grafico 3: PieChart */}
        <View className="mb-8 bg-gray-100 p-4 rounded-xl">
          <Text className="text-lg font-semibold text-secondary mb-2">Distribuzione clienti</Text>
          <PieChart
            data={[
              { name: "Over 65", population: 3, color: "#0073ff", legendFontColor: "#64748b", legendFontSize: 14 },
              { name: "Età 50-65", population: 4, color: "#22c55e", legendFontColor: "#64748b", legendFontSize: 14 },
              { name: "Under 50", population: 8, color: "#f59e42", legendFontColor: "#64748b", legendFontSize: 14 },
            ]}
            width={screenWidth - 56}
            height={180}
            chartConfig={{
              backgroundColor: "#f3f4f6",
              backgroundGradientFrom: "#f3f4f6",
              backgroundGradientTo: "#f3f4f6",
              color: () => "#0073ff",
              labelColor: () => "#64748b",
            }}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            absolute
            style={{ borderRadius: 16 }}
          />
        </View>
        <TouchableOpacity
          onPress={handleLogout}
          className="w-full bg-red-500 py-4 rounded-xl items-center mt-8"
        >
          <Text className="text-white text-lg font-semibold">
            Disconnetti
          </Text>
        </TouchableOpacity>
      </ScrollView>

    </View>
  );
}