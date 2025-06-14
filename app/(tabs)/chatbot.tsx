import { Text, View } from "react-native";
import Header from "../../components/Header";

export default function Chatbot() {
  return (
    <View className="flex-1 bg-white">
      <Header />
      <View className="flex-1 items-center justify-center">
        <Text className="text-secondary">Chatbot</Text>
      </View>
    </View>
  );
}