import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import { View, Text, ScrollView, Dimensions, TouchableOpacity, RefreshControl } from "react-native";
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
    usernameAutista?: string;
    dataCorsa?: string;
    partito: boolean;
    clienteUsername?: string;
    autistaUsername?: string;
  };

  const [corseUtente, setCorseUtente] = useState<Ride[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [autistiChartLabels, setAutistiChartLabels] = useState<string[]>([]);
  const [autistiChartData, setAutistiChartData] = useState<number[]>([]);
  const [utenti, setUtenti] = useState<string[]>([])
  const [etaDistribuzione, setEtaDistribuzione] = useState({
    over65: 0,
    between50And65: 0,
    under50: 0,
  });
  const invokeURL = 'https://nci92kc6ri.execute-api.us-east-1.amazonaws.com/dev';


  const handleGetAll = async () => {
    try {
      const userId = await AsyncStorage.getItem('idUsr');
      const getUser = await fetch(invokeURL + "/users/" + userId, {
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

      // Creiamo una mappa userID-user object per ricerche efficienti
      const userMap = usersList.reduce((acc: { [key: string]: any }, user: any) => {
        acc[user.id] = user;
        return acc;
      }, {});
      
      const enrichedTrips = tripsList.map((trip: any) => {
        const cliente = userMap[trip.idUser];
        const autista = userMap[trip.idAutista];
        const dataCorsa = autista?.data ? new Date(autista.data).toLocaleDateString() : 'N/D';
        
        return {
          ...trip,
          clienteUsername: cliente?.username || 'N/D',
          autistaUsername: autista?.username || 'N/D',
          dataCorsa: dataCorsa,
        };
      });

      setCorseUtente(enrichedTrips);

      const utentiFiltrati = usersList.filter((user: any) => user.ruolo === 'utente');
      setUtenti(utentiFiltrati);
      handleContEta(utentiFiltrati);

      // Calcolo corse per autista
      const autisti = usersList.filter((user: any) => user.ruolo === 'autista');
      const corsePerAutista: { [username: string]: number } = {};

      autisti.forEach((autista: any) => {
        const count = tripsList.filter((trip: any) => trip.idAutista === autista.id).length;
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

  const handleContEta = (utentiDaCalcolare: any[]) => {
    const now = new Date();
    const newCounts = {
      over65: 0,
      between50And65: 0,
      under50: 0,
    };

    utentiDaCalcolare.forEach((utente: any) => {
      if (!utente.nascita) return;

      const birthDate = new Date(utente.nascita);
      let age = now.getFullYear() - birthDate.getFullYear();
      const m = now.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age > 65) {
        newCounts.over65++;
      } else if (age >= 50) {
        newCounts.between50And65++;
      } else {
        newCounts.under50++;
      }
    });

    setEtaDistribuzione(newCounts);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await handleGetAll();
    setRefreshing(false);
  }, []);

  const pieData = (() => {
    const { over65, between50And65, under50 } = etaDistribuzione;
    const total = over65 + between50And65 + under50;
    if (total === 0) {
      return [{
        name: "Nessun dato",
        population: 1,
        color: "#d1d5db",
        legendFontColor: "#9ca3af",
        legendFontSize: 14,
      }];
    }
    return [
      {
        name: "Over 65",
        population: over65,
        color: "#0073ff",
        legendFontColor: "#64748b",
        legendFontSize: 14,
      },
      {
        name: "Età 50-65",
        population: between50And65,
        color: "#22c55e",
        legendFontColor: "#64748b",
        legendFontSize: 14,
      },
      {
        name: "Under 50",
        population: under50,
        color: "#f59e42",
        legendFontColor: "#64748b",
        legendFontSize: 14,
      },
    ];
  })();

  const handleLogout = async () => {
    clearCurrentUser();
    // Forziamo un refrash 
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
      <ScrollView 
        className="flex-1 p-6 mb-10"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text className="text-3xl font-bold text-secondary mb-8">Pannello di controllo</Text>
        {/* Lista corse prenotate */}
        <View className="mb-8 bg-gray-100 p-4 rounded-xl">
          <Text className="text-lg font-semibold text-secondary mb-2">Corse prenotate</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View>
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
                  <View style={{ width: 120 }} className="px-2">
                    <Text className="font-bold text-secondary text-center">Partenza</Text>
                  </View>
                  <View style={{ width: 1, backgroundColor: '#0073ff' }} />
                  <View style={{ width: 120 }} className="px-2">
                    <Text className="font-bold text-secondary text-center">Destinazione</Text>
                  </View>
                  <View style={{ width: 1, backgroundColor: '#0073ff' }} />
                </View>
              </View>
              <ScrollView style={{ maxHeight: 4 * 44 }} showsVerticalScrollIndicator={true}>
                {corseUtente.map((corsa, idx) => (

                  <View key={corsa.id || idx} className="flex-row py-2 bg-white/60" style={{ borderBottomWidth: idx < corseUtente.length - 1 ? 1 : 0, borderBottomColor: '#0073ff' }}>
                    
                    <View style={{ width: 120 }} className="px-2 justify-center items-center">
                      <Text className="text-secondary text-center">{corsa.clienteUsername ?? "Cliente"}</Text>
                    </View>
                    <View style={{ width: 1, backgroundColor: '#0073ff' }} />
                    <View style={{ width: 120 }} className="px-2 justify-center items-center">
                      <Text className="text-secondary text-center">{corsa.autistaUsername ?? "N/D"}</Text>
                    </View>
                    <View style={{ width: 1, backgroundColor: '#0073ff' }} />
                    <View style={{ width: 120 }} className="px-2 justify-center items-center">
                      <Text className="text-secondary text-center">{corsa.addA}</Text>
                    </View>
                    <View style={{ width: 1, backgroundColor: '#0073ff' }} />
                    <View style={{ width: 120 }} className="px-2 justify-center items-center">
                      <Text className="text-secondary text-center">{corsa.addB}</Text>
                    </View>
                    <View style={{ width: 1, backgroundColor: '#0073ff' }} />
                    <View style={{ width: 100 }} className="px-2 justify-center items-center">
                      <Text className="text-secondary text-center">{corsa.dataCorsa ?? "N/D"}</Text>
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
              segments={autistiChartData.length > 0 && Math.max(...autistiChartData) > 0 ? Math.max(...autistiChartData) : 4}
            
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
                  //rotation: 30, // effetto visivo simulato per vedere tutto il nome
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
              {
                name: "Over 65",
                population: etaDistribuzione.over65,
                color: "#0073ff",
                legendFontColor: "#64748b",
                legendFontSize: 14,
              },
              {
                name: "Età 50-65",
                population: etaDistribuzione.between50And65,
                color: "#22c55e",
                legendFontColor: "#64748b",
                legendFontSize: 14,
              },
              {
                name: "Under 50",
                population: etaDistribuzione.under50,
                color: "#f59e42",
                legendFontColor: "#64748b",
                legendFontSize: 14,
              },
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