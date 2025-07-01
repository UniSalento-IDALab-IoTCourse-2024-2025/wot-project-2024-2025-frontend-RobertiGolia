import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { RadioButton } from 'react-native-paper';
import { Alert, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { addDriver } from '../../constants/drivers';

export default function DriverRegistration() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [username, setUsername] = useState('')
  const [dataNascita, setDataNascita] = useState(new Date());
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [veicolo, setVeicolo] = useState('')
  const [disponibile, setDisponibile] = useState(true)
  const [ruolo, setRuolo] = useState("autista")
  const [checked, setChecked] = React.useState('first');
  const [error, setError] = useState('')
  const [posti, setPosti] = useState('');

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

    if (veicolo == null) {
      Alert.alert('Errore', 'Veicolo non valido');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Errore', 'La password deve contenere almeno 6 caratteri');
      return;
    }

    if (!posti || isNaN(Number(posti)) || Number(posti) <= 0) {
      Alert.alert('Errore', 'Inserisci un numero di posti valido');
      return;
    }

    const registrationDto = {
      nome,
      cognome,
      email,
      password,
      veicolo,
      disponibile,
      ruolo,
      data_nascita: dataNascita.toISOString().split('T')[0], // opzionale se vuoi mandare anche la data
      n_posti: Number(posti)
    };

    try {
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

      Alert.alert(
        'Successo',
        'Registrazione completata con successo',
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
              <Text className="text-secondary mb-2 text-base">Username *</Text>
              <TextInput
                className="w-full bg-gray-100 rounded-xl px-4 py-3"
                placeholder="Inserisci il tuo username"
                value={username}
                onChangeText={setUsername}
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
              <Text className="text-secondary mb-2 text-base">Password *</Text>
              <TextInput
                className="w-full bg-gray-100 rounded-xl px-4 py-3"
                placeholder="Inserisci la tua password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <RadioButton
                value="macchina"
                status={checked === 'primo' ? 'checked' : 'unchecked'}
                onPress={() => {setChecked('primo'), setVeicolo("macchina")}}
               
              />
              <TouchableOpacity onPress={() => setChecked('primo')}>
                <Text style={{ fontSize: 16 }}>Macchina</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <RadioButton
                value="autobus"
                color="#0073ff"
                status={checked === 'secondo' ? 'checked' : 'unchecked'}
                onPress={() => {setChecked('secondo'), setVeicolo("autobus")}}
              />
              <TouchableOpacity onPress={() => setChecked('secondo')}>
                <Text style={{ fontSize: 16 }}>Autobus</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton
                value="camper"
                status={checked === 'terzo' ? 'checked' : 'unchecked'}
                onPress={() => {setChecked('terzo'), setVeicolo("camper")}}
              />
              <TouchableOpacity onPress={() => setChecked('terzo')}>
                <Text style={{ fontSize: 16 }}>Camper</Text>
              </TouchableOpacity>
            </View>

            <View>
              <Text className="text-secondary mb-2 text-base">Numero di posti *</Text>
              <TextInput
                className="w-full bg-gray-100 rounded-xl px-4 py-3"
                placeholder="Inserisci il numero di posti del veicolo"
                value={posti}
                onChangeText={setPosti}
                keyboardType="numeric"
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
        </View>
      </ScrollView>
    </>
  );
} 