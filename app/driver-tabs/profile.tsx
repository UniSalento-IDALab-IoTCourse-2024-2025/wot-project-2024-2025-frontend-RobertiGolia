import { useRouter } from "expo-router";
import * as Updates from 'expo-updates';
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Header from "../../components/Header";
import { clearCurrentUser, getCurrentUser } from "../../constants/currentUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Profile() {
  const router = useRouter();
  const currentUser = getCurrentUser();

  

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

  const handleAutista = async () => {
    try {
      const role = await AsyncStorage.getItem("ruolo");
      if (role === "autista") {
        console.log(role);
      }
    } catch (error) {
      console.error("Errore durante il recupero del ruolo:", error);
    }
  };
  
  return (
    <GestureHandlerRootView>
      <View className="flex-1 bg-white">
        <Header />
        <View className="flex-1 p-6">
          <Text className="text-3xl font-bold text-secondary mb-8">Il tuo profilo</Text>
          <View className="bg-gray-100 p-4 rounded-xl">
              <Text className="text-gray-500 text-sm">ID</Text>
              <Text className="text-secondary text-lg">{AsyncStorage.getItem('idUsr')}</Text>
            </View>
          <View className="space-y-4 gap-4">
            <View className="bg-gray-100 p-4 rounded-xl">
              <Text className="text-gray-500 text-sm">Nome</Text>
              <Text className="text-secondary text-lg">{AsyncStorage.getItem('nome')}</Text>
              

            </View>

            <View className="bg-gray-100 p-4 rounded-xl">
              <Text className="text-gray-500 text-sm">Cognome</Text>
              <Text className="text-secondary text-lg">{AsyncStorage.getItem('cognome')}</Text>
            </View>

            

            <View className="bg-gray-100 p-4 rounded-xl">
              <Text className="text-gray-500 text-sm">Email</Text>
              <Text className="text-secondary text-lg">{AsyncStorage.getItem('email')}</Text>
            </View>

            <View className="bg-gray-100 p-4 rounded-xl">
              <Text className="text-gray-500 text-sm">Username</Text>
              <Text className="text-secondary text-lg">{AsyncStorage.getItem('username')}</Text>
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
    </GestureHandlerRootView>
  );
} 