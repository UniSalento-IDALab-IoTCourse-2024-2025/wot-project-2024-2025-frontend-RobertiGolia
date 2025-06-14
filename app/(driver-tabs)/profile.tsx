import { useRouter } from "expo-router";
import * as Updates from 'expo-updates';
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Header from "../../components/Header";
import { clearCurrentDriver, getCurrentDriver } from "../../constants/currentDriver";

export default function Profile() {
  const router = useRouter();
  const currentDriver = getCurrentDriver();

  useEffect(() => {
    if (!currentDriver) {
      router.replace('/');
    }
  }, [currentDriver]);

  if (!currentDriver) {
    return null;
  }

  const handleLogout = async () => {
    clearCurrentDriver();
    try {
      await Updates.reloadAsync();
    } catch (error) {
      router.replace('/');
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Header />
      <View className="flex-1 p-6">
        <Text className="text-3xl font-bold text-secondary mb-8">Il tuo profilo</Text>
        
        <View className="space-y-4 gap-4">
          <View className="bg-gray-100 p-4 rounded-xl">
            <Text className="text-gray-500 text-sm">Nome</Text>
            <Text className="text-secondary text-lg">{currentDriver.nome}</Text>
          </View>

          <View className="bg-gray-100 p-4 rounded-xl">
            <Text className="text-gray-500 text-sm">Cognome</Text>
            <Text className="text-secondary text-lg">{currentDriver.cognome}</Text>
          </View>

          <View className="bg-gray-100 p-4 rounded-xl">
            <Text className="text-gray-500 text-sm">Data di nascita</Text>
            <Text className="text-secondary text-lg">
              {currentDriver.dataNascita.toLocaleDateString()}
            </Text>
          </View>

          <View className="bg-gray-100 p-4 rounded-xl">
            <Text className="text-gray-500 text-sm">Email</Text>
            <Text className="text-secondary text-lg">{currentDriver.email}</Text>
          </View>

          <View className="bg-gray-100 p-4 rounded-xl">
            <Text className="text-gray-500 text-sm">Veicolo</Text>
            <Text className="text-secondary text-lg">{currentDriver.veicolo}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          className="w-full bg-red-500 py-4 rounded-xl items-center mt-8"
        >
          <Text className="text-white text-lg font-semibold">
            Disconnetti
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 