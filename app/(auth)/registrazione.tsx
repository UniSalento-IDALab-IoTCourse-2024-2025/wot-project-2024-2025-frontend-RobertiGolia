import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { addUser } from '../../constants/users';

export default function Registrazione() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  //const [dataNascita, setDataNascita] = useState(new Date());
  const [username, setusername] = useState("");
  const [email, setEmail] = useState('');
  const [email_parente, setEmailParente] = useState('');
  const [password, setPassword] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState('')
  const invokeURL = 'https://nci92kc6ri.execute-api.us-east-1.amazonaws.com/dev';

  const handleRegistrazione = async () => {
    if (!nome || !cognome || !email || !password) {
      Alert.alert('Errore', 'Per favore compila tutti i campi obbligatori');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Errore', 'Inserisci un indirizzo email valido');
      return;
    }

    if (email_parente && !emailRegex.test(email_parente)) {
      Alert.alert('Errore', 'Inserisci un indirizzo email valido per il parente');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Errore', 'La password deve contenere almeno 6 caratteri');
      return;
    }

    const registrationDto = {
      nome: nome.trim(),
      cognome: cognome.trim(),
      email: email.trim(),
      password,
      email_parente: email_parente ? email_parente.trim() : null,
      username: username.trim()
    };
    console.log("DTO inviato:", JSON.stringify(registrationDto, null, 2));


    try {
      console.log(registrationDto.email)
      console.log(registrationDto.email_parente)
      const response = await fetch(invokeURL + "/registration", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registrationDto)
      });

      if (!response.ok) {
        console.log('ricevuto HTTP status ' + response.status);
        setError('Registrazione fallita');
        return;
      }
      const info = await response.json()
      const { message } = info
      Alert.alert(
        'Successo',
        message,
        [
          {
            text: 'OK',
            onPress: () => router.push('/login')
          }
        ]
      );
    } catch (error) {
      console.error("Errore durante la registrazione:", error);
      Alert.alert('Errore', 'Errore di rete o del server');
    }

  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      //setDataNascita(selectedDate);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView className="flex-1 bg-white">
        <View className="p-6 pt-16">
          <Text className="text-3xl font-bold text-secondary mb-8 text-center">
            Registrazione
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
              <Text className="text-secondary mb-2 text-base">Username *</Text>
              <TextInput
                className="w-full bg-gray-100 rounded-xl px-4 py-3"
                placeholder="Inserisci il tuo username"
                value={username}
                onChangeText={setusername}
              />
            </View>

            <View>
              <Text className="text-secondary mb-2 text-base">Data di nascita *</Text>
              <TouchableOpacity
                className="w-full bg-gray-100 rounded-xl px-4 py-3"
                onPress={() => setShowDatePicker(true)}
              >
              </TouchableOpacity>
              {/*<Text className="text-secondary">{dataNascita.toLocaleDateString()}</Text>*/}
              {/*</TouchableOpacity>
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
              )*/}
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
              <Text className="text-secondary mb-2 text-base">Email di un parente (facoltativa)</Text>
              <TextInput
                className="w-full bg-gray-100 rounded-xl px-4 py-3"
                placeholder="Inserisci l'email di un parente"
                value={email_parente}
                onChangeText={(text) => setEmailParente(text.trim())}
                autoCapitalize="none"
                keyboardType="email-address"
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
            onPress={() => router.push('/login')}
            className="items-center mt-4"
          >
            <Text className="text-[#0073ff] text-base">
              Hai già un account? Accedi
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(auth)/driver-registration')}
            className="items-center mt-4"
          >
            <Text className="text-[#0073ff] text-base">
              Diventa un volontario
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
} 