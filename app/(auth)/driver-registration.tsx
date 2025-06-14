import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { addDriver } from '../../constants/drivers';

export default function DriverRegistration() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [dataNascita, setDataNascita] = useState(new Date());
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [veicolo, setVeicolo] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleRegistrazione = () => {
    if (!nome || !cognome || !email || !password || !veicolo) {
      Alert.alert('Errore', 'Per favore compila tutti i campi obbligatori');
      return;
    }

    // Validazione email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Errore', 'Inserisci un indirizzo email valido');
      return;
    }

    // Validazione password minimo 6 caratteri
    if (password.length < 6) {
      Alert.alert('Errore', 'La password deve contenere almeno 6 caratteri');
      return;
    }

    addDriver({
      nome,
      cognome,
      dataNascita,
      email,
      password,
      veicolo
    });

    Alert.alert(
      'Successo',
      'Registrazione completata con successo',
      [
        {
          text: 'OK',
          onPress: () => router.push('/(auth)/driver-login')
        }
      ]
    );
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDataNascita(selectedDate);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView className="flex-1 bg-white">
        <View className="p-6 pt-16">
          <Text className="text-3xl font-bold text-secondary mb-8 text-center">
            Registrazione Autista
          </Text>

          <View className="space-y-4">
            <View>
              <Text className="text-secondary mb-2 text-base">Nome *</Text>
              <TextInput
                className="w-full bg-gray-100 rounded-xl px-4 py-3"
                placeholder="Inserisci il tuo nome"
                value={nome}
                onChangeText={setNome}
              />
            </View>

            <View>
              <Text className="text-secondary mb-2 text-base">Cognome *</Text>
              <TextInput
                className="w-full bg-gray-100 rounded-xl px-4 py-3"
                placeholder="Inserisci il tuo cognome"
                value={cognome}
                onChangeText={setCognome}
              />
            </View>

            <View>
              <Text className="text-secondary mb-2 text-base">Data di nascita *</Text>
              <TouchableOpacity 
                className="w-full bg-gray-100 rounded-xl px-4 py-3"
                onPress={() => setShowDatePicker(true)}
              >
                <Text className="text-secondary">{dataNascita.toLocaleDateString()}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={dataNascita}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateChange}
                  textColor="#1f2937"
                  themeVariant="light"
                  accentColor="#0073ff"
                />
              )}
            </View>

            <View>
              <Text className="text-secondary mb-2 text-base">Email *</Text>
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
              <Text className="text-secondary mb-2 text-base">Veicolo *</Text>
              <TextInput
                className="w-full bg-gray-100 rounded-xl px-4 py-3"
                placeholder="Inserisci il tuo veicolo (es. Fiat Panda)"
                value={veicolo}
                onChangeText={setVeicolo}
              />
            </View>

            <View>
              <Text className="text-secondary mb-2 text-base">Password *</Text>
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
            onPress={handleRegistrazione}
            className="w-full bg-[#0073ff] py-4 rounded-xl items-center mt-8"
          >
            <Text className="text-white text-lg font-semibold">
              Completa registrazione
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(auth)/driver-login')}
            className="items-center mt-4"
          >
            <Text className="text-[#0073ff] text-base">
              Hai già un account? Accedi
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
} 