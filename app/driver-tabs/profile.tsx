import { useRouter } from "expo-router";
import * as Updates from 'expo-updates';
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Header from "../../components/Header";
import { clearCurrentUser } from "../../constants/currentUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Profile() {
  const router = useRouter();
  const [n_posti, setNPosti] = useState<number | null>(null);
  const [idUsr, setIdUsr] = useState<string | null>(null);
  const [nome, setNome] = useState<string | null>(null);
  const [cognome, setCognome] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);



  const handleLogout = async () => {
    clearCurrentUser();
    // Forziamo un reload completo dell'app
    try {
      //await Updates.reloadAsync();
      await AsyncStorage.removeItem('nome')
      await AsyncStorage.removeItem('ruolo')
      await AsyncStorage.removeItem('idUsr')
      await AsyncStorage.removeItem('email')
      await AsyncStorage.removeItem('data_nascita')
      await AsyncStorage.removeItem('username')
      await AsyncStorage.removeItem('cognome')
      await AsyncStorage.removeItem('n_posti')
      router.replace('/(auth)/login')
    } catch (error) {
      console.log(error)

    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const id = await AsyncStorage.getItem('idUsr');
      const nomeValue = await AsyncStorage.getItem('nome');
      const cognomeValue = await AsyncStorage.getItem('cognome');
      const emailValue = await AsyncStorage.getItem('email');
      const usernameValue = await AsyncStorage.getItem('username');
      const n_posti_value = await AsyncStorage.getItem('n_posti');

      if (id !== null) setIdUsr(id);
      if (nomeValue !== null) setNome(nomeValue);
      if (cognomeValue !== null) setCognome(cognomeValue);
      if (emailValue !== null) setEmail(emailValue);
      if (usernameValue !== null) setUsername(usernameValue);
      if (n_posti_value !== null) {
        setNPosti(parseInt(n_posti_value, 10));
      }
    };
    fetchUserData();
  }, []);
  return (
    <GestureHandlerRootView>
      <View className="flex-1 bg-white">
        <Header />

        <ScrollView className="p-6">

          <Text className="text-3xl font-bold text-secondary mb-8">Il tuo profilo</Text>

          <View>
            <View className="bg-gray-100 p-4 rounded-xl mb-4">
              <Text className="text-gray-500 text-sm">ID</Text>
              <Text className="text-secondary text-lg">{idUsr ?? 'Caricamento...'}</Text>
            </View>
            
            <View className="bg-gray-100 p-4 rounded-xl mb-4">
              <Text className="text-gray-500 text-sm">Nome</Text>
              <Text className="text-secondary text-lg">{nome ?? 'Caricamento...'}</Text>
            </View>

            <View className="bg-gray-100 p-4 rounded-xl mb-4">
              <Text className="text-gray-500 text-sm">Cognome</Text>
              <Text className="text-secondary text-lg">{cognome ?? 'Caricamento...'}</Text>
            </View>

            <View className="bg-gray-100 p-4 rounded-xl mb-4">
              <Text className="text-gray-500 text-sm">Email</Text>
              <Text className="text-secondary text-lg">{email ?? 'Caricamento...'}</Text>
            </View>

            <View className="bg-gray-100 p-4 rounded-xl mb-4">
              <Text className="text-gray-500 text-sm">Username</Text>
              <Text className="text-secondary text-lg">{username ?? 'Caricamento...'}</Text>
            </View>

            <View className="bg-gray-100 p-4 rounded-xl">
              <Text className="text-gray-500 text-sm">Numero posti a disposizione</Text>
              <Text className="text-secondary text-lg">
                {n_posti !== null ? n_posti : 'Caricamento...'}
              </Text>
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
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
} 