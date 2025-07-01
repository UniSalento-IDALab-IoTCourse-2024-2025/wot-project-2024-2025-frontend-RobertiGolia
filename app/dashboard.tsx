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
  const [autisti, setAutisti] = useState<any[]>([])
  const [etaDistribuzione, setEtaDistribuzione] = useState({
    over65: 0,
    between50And65: 0,
    under50: 0,
  });
  const [labels, setLabels] = useState<string[]>([]);
  const [corsePerAutista, setCorsePerAutista] = useState<{ [username: string]: number }>({});
  const [chartWidth, setChartWidth] = useState<number>(0);
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
      const autistiLocal = usersList.filter((user: any) => user.ruolo === 'autista');
      setAutisti(autistiLocal);
      const corsePerAutistaObj: { [username: string]: number } = {};
      autistiLocal.forEach((autista: any) => {
        const count = tripsList.filter((trip: any) => trip.idAutista === autista.id).length;
        corsePerAutistaObj[autista.username] = count;
      });
      setCorsePerAutista(corsePerAutistaObj);
      // Mostra ogni username per intero, senza abbreviazioni, e senza duplicati
      const labelsSet = new Set<string>();
      const labelsArr = Object.keys(corsePerAutistaObj)
        .filter((username: string) => username && username !== 'null' && username !== 'undefined')
        .filter((username: string) => {
          if (labelsSet.has(username)) return false;
          labelsSet.add(username);
          return true;
        });
      setLabels(labelsArr);
      // Calcola la larghezza della colonna in base al nome più lungo
      const maxUsernameLength = labelsArr.reduce((max: number, u: string) => Math.max(max, u.length), 0);
      const colWidth = Math.max(60, maxUsernameLength * 11 + 16); // 11px per lettera + padding
      setChartWidth(labelsArr.length * colWidth);

      const values = Object.values(corsePerAutistaObj);

      setAutistiChartLabels(labelsArr);
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
                  <View style={{ width: 100 }} className="px-2">
                    <Text className="font-bold text-secondary text-center">Data</Text>
                  </View>
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
          {labels.length === 0 || chartWidth === 0 ? (
            <Text className="text-center text-gray-400 py-12">Nessun dato disponibile</Text>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              {/* Etichette Y fisse migliorate */}
              <View style={{ height: 260, justifyContent: 'space-between', alignItems: 'flex-end', marginRight: 4, paddingTop: 8, paddingBottom: 8 }}>
                {(() => {
                  const chartHeight = 260 - 16; // padding top+bottom
                  const segments = labels.length > 0
                    ? (() => {
                        const max = Math.max(...labels.map((lab: string) => corsePerAutista[lab] ?? 0));
                        if (max <= 1) return 1;
                        if (max === 2) return 2;
                        if (max === 3) return 3;
                        return 4;
                      })()
                    : 4;
                  const maxValue = labels.length > 0 ? Math.max(...labels.map((lab: string) => corsePerAutista[lab] ?? 0)) : 0;
                  // Genera le etichette Y dall'alto verso il basso, escludendo lo zero
                  return Array.from({ length: segments }, (_, i) => {
                    const value = Math.round(maxValue - (maxValue / segments) * i);
                    const isFirst = i === 0;
                    return (
                      <Text
                        key={i}
                        style={{
                          height: chartHeight / segments,
                          textAlign: 'right',
                          color: '#64748b',
                          fontSize: 12,
                          includeFontPadding: false,
                          textAlignVertical: 'bottom',
                          paddingBottom: 3,
                          marginTop: value === 1 ? -4 : 0,
                        }}
                      >
                        {value}
                      </Text>
                    );
                  });
                })()}
              </View>
              {/* Grafico scrollabile */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <BarChart
                  data={{
                    labels: labels,
                    datasets: [
                      {
                        data: labels.map((lab: string) => corsePerAutista[lab] ?? 0),
                        color: () => "#0073ff",
                      },
                    ],
                  }}
                  width={chartWidth}
                  height={260}
                  yAxisLabel={""}
                  yAxisSuffix={""}
                  withHorizontalLabels={false} // Disabilita le etichette Y del grafico
                  fromZero={true}
                  segments={
                    labels.length > 0
                      ? (() => {
                          const max = Math.max(...labels.map((lab: string) => corsePerAutista[lab] ?? 0));
                          if (max <= 1) return 1;
                          if (max === 2) return 2;
                          if (max === 3) return 3;
                          return 4;
                        })()
                      : 4
                  }
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
                      fill: "#64748b",
                    },
                  }}
                  style={{ borderRadius: 16, paddingRight: 0, paddingLeft: 0 }}
                />
              </ScrollView>
            </View>
          )}
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