import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { setCurrentUser } from '../../constants/currentUser';
import { findUserByCredentials } from '../../constants/users';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const user = findUserByCredentials(email, password);
    if (user) {
      setError('');
      setCurrentUser(user);
      router.push('/(tabs)');
    } else {
      setError('Credenziali non valide');
      Alert.alert('Errore', 'Credenziali non valide');
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-white p-6 justify-center">
        <View className="space-y-6">
          <Text className="text-3xl font-bold text-secondary mb-8 text-center">
            Area Clienti
          </Text>

          {error ? (
            <Text className="text-red-500 text-center mb-4">{error}</Text>
          ) : null}

          <View className="space-y-4">
            <View>
              <Text className="text-secondary mb-2 text-base">Email</Text>
              <TextInput
                className="w-full bg-gray-100 rounded-xl px-4 py-3"
                placeholder="Inserisci la tua email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View>
              <Text className="text-secondary mb-2 text-base">Password</Text>
              <TextInput
                className="w-full bg-gray-100 rounded-xl px-4 py-3"
                placeholder="Inserisci la tua password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            className="w-full bg-[#0073ff] py-4 rounded-xl items-center mt-6"
          >
            <Text className="text-white text-lg font-semibold">
              Accedi
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(auth)/registrazione')}
            className="items-center mt-4"
          >
            <Text className="text-[#0073ff] text-base">
              Non hai un account? Registrati
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
} 