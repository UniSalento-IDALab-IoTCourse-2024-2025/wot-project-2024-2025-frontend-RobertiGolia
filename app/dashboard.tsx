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
        {/* Grafico 1: LineChart */}
        <View className="mb-8 bg-gray-100 p-4 rounded-xl">
          <Text className="text-lg font-semibold text-secondary mb-2">Andamento corse settimanali</Text>
          <LineChart
            data={{
              labels: ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"],
              datasets: [
                {
                  data: [12, 19, 10, 15, 22, 18, 9],
                  color: () => "#0073ff",
                },
              ],
            }}
            width={screenWidth - 56}
            height={180}
            chartConfig={{
              backgroundColor: "#f3f4f6",
              backgroundGradientFrom: "#f3f4f6",
              backgroundGradientTo: "#f3f4f6",
              decimalPlaces: 0,
              color: () => "#0073ff",
              labelColor: () => "#64748b",
              propsForDots: {
                r: "5",
                strokeWidth: "2",
                stroke: "#0073ff",
              },
            }}
            bezier
            style={{ borderRadius: 16 }}
          />
        </View>
        {/* Grafico 2: BarChart */}
        <View className="mb-8 bg-gray-100 p-4 rounded-xl">
          <Text className="text-lg font-semibold text-secondary mb-2">Corse per autista</Text>
          <BarChart
            data={{
              labels: ["Mario", "Luca", "Anna", "Sara"],
              datasets: [
                {
                  data: [8, 15, 6, 12],
                },
              ],
            }}
            width={screenWidth - 56}
            height={180}
            yAxisLabel={""}
            yAxisSuffix={""}
            chartConfig={{
              backgroundColor: "#f3f4f6",
              backgroundGradientFrom: "#f3f4f6",
              backgroundGradientTo: "#f3f4f6",
              decimalPlaces: 0,
              color: () => "#0073ff",
              labelColor: () => "#64748b",
            }}
            style={{ borderRadius: 16 }}
          />
        </View>
        {/* Grafico 3: PieChart */}
        <View className="mb-8 bg-gray-100 p-4 rounded-xl">
          <Text className="text-lg font-semibold text-secondary mb-2">Distribuzione clienti</Text>
          <PieChart
            data={[
              { name: "Over 65", population: 40, color: "#0073ff", legendFontColor: "#64748b", legendFontSize: 14 },
              { name: "Disabili", population: 25, color: "#22c55e", legendFontColor: "#64748b", legendFontSize: 14 },
              { name: "Altro", population: 35, color: "#f59e42", legendFontColor: "#64748b", legendFontSize: 14 },
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