import React from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import Header from "../components/Header";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function Dashboard() {
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
                {[
                  { cliente: "Giovanni Rossi", autista: "mrosii", data: "2024-06-01", partenza: "Via Roma 10", destinazione: "Ospedale Centrale" },
                  { cliente: "Maria Bianchi", autista: "fbianchi", data: "2024-06-02", partenza: "Piazza Duomo", destinazione: "Stazione FS" },
                  { cliente: "Luca Verdi", autista: "sverdi", data: "2024-06-03", partenza: "Via Milano 5", destinazione: "Università" },
                  { cliente: "Anna Neri", autista: "cperrone", data: "2024-06-04", partenza: "Corso Italia 22", destinazione: "Centro Commerciale" },
                  { cliente: "Paolo Gialli", autista: "dtotti", data: "2024-06-05", partenza: "Via Firenze 8", destinazione: "Museo Civico" },
                  { cliente: "Francesca Blu", autista: "abaglio", data: "2024-06-06", partenza: "Via Napoli 3", destinazione: "Teatro" },
                ].map((corsa, idx, arr) => (
                  <View key={idx} className="flex-row py-2 bg-white/60" style={{ borderBottomWidth: idx < arr.length - 1 ? 1 : 0, borderBottomColor: '#0073ff' }}>
                    <View style={{ width: 120 }} className="px-2 justify-center items-center">
                      <Text className="text-secondary text-center">{corsa.cliente}</Text>
                    </View>
                    <View style={{ width: 1, backgroundColor: '#0073ff' }} />
                    <View style={{ width: 120 }} className="px-2 justify-center items-center">
                      <Text className="text-secondary text-center">{corsa.autista}</Text>
                    </View>
                    <View style={{ width: 1, backgroundColor: '#0073ff' }} />
                    <View style={{ width: 100 }} className="px-2 justify-center items-center">
                      <Text className="text-secondary text-center">{corsa.data}</Text>
                    </View>
                    <View style={{ width: 1, backgroundColor: '#0073ff' }} />
                    <View style={{ width: 120 }} className="px-2 justify-center items-center">
                      <Text className="text-secondary text-center">{corsa.partenza}</Text>
                    </View>
                    <View style={{ width: 1, backgroundColor: '#0073ff' }} />
                    <View style={{ width: 120 }} className="px-2 justify-center items-center">
                      <Text className="text-secondary text-center">{corsa.destinazione}</Text>
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
                labels: ["mrosii", "fbianchi", "sverdi", "cperrone", "dtotti", "abaglio", "czalone"],
                datasets: [
                  {
                    data: [12, 41, 15, 10, 10, 24, 12],
                    color: () => "#0073ff",
                  },
                ],
              }}
              width={Math.max(screenWidth - 56, 60 * 7)}
              height={260}
              yAxisLabel={""}
              yAxisSuffix={""}
              withHorizontalLabels={true}
              fromZero={true}
              yAxisInterval={10}
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
                  fontSize: 12,
                  fill: "#64748b",
                },
              }}
              style={{ borderRadius: 16, paddingRight: 50, paddingLeft: 20}}
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
      </ScrollView>
    </View>
  );
}