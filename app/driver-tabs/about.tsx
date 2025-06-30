import { Text, View } from "react-native";
import Header from "../../components/Header";

export default function About() {
  return (
    <View className="flex-1 bg-white">
      <Header />
      <View className="flex-1 p-6">
        <Text className="text-3xl font-bold text-secondary mb-8">About us</Text>
        
        <View className="bg-gray-100 p-4 rounded-xl">
          <Text className="text-secondary text-base leading-6">
            "Taxi sociale", un'app per permettere a chiunque di spostarsi con facilità
            (versione alpha).{"\n\n"}
            Creato da Roberti Luigi e Golia Cristian, per l'esame di "Internet of Things"
            del corso magistrale in Ingegneria informatica, Unisalento.
          </Text>
        </View>
      </View>
    </View>
  );
} 