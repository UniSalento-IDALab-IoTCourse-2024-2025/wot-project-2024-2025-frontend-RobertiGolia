import { Text, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import Header from "../../components/Header";
import { useState, useRef } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Chatbot() {
  const router = useRouter();
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);
  const [availableDrivers, setAvailableDrivers] = useState<string[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [n_posti, setNPosti] = useState(Number)
  const invokeURL = 'https://nci92kc6ri.execute-api.us-east-1.amazonaws.com/dev'
  const [autistiDisponibili, setAutistiDisponibili] = useState<{ nome: string, id: string }[]>([]);
  const [idAutisti, setidAutisti] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [output, setOutput] = useState('');


  const handleSendMessage = async () => {
    try {
      if (!inputText.trim()) return;

      setMessages(prev => [...prev, { text: inputText, isUser: true }]);

      const response = await fetch(`${invokeURL}/run-model/${inputText}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        console.log('HTTP error:', response.status);
        setError('Errore durante la richiesta');
        return;
      }

      const data = await response.json();
      const driversList = data?.output?.drivers || [];

      const disponibili: { nome: string, id: string }[] = [];
      console.log(driversList)
      for (const driverName of driversList) {
        const formatted = formatDriverName(driverName);

        const getAutista = await fetch(`${invokeURL}/username/${formatted}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!getAutista.ok) {
          console.log('Errore fetch autista:', getAutista.status);
          continue;
        }

        const autista = await getAutista.json();
        const { n_posti, id } = autista;

        if (n_posti > 0) {
          disponibili.push({ nome: formatted, id });
        } else {
          const changeDispo = await fetch(`${invokeURL}/users/changeDispo/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
          });

          if (!changeDispo.ok) {
            const errText = await changeDispo.text();
            console.log('Errore HTTP ' + changeDispo.status + ': ' + errText);
            setError('Cambio disponibilità fallito');
            continue;
          }

          // Solo log per debug, senza riusare 'data'
          const changeResponse = await changeDispo.json();
          console.log('Messaggio cambio disponibilità:', changeResponse.message);
        }
      }

      const messaggioOutput = disponibili.length > 0
        ? "Seleziona un autista tra quelli disponibili:"
        : "Nessun autista disponibile.";

      setAutistiDisponibili(disponibili);
      setAvailableDrivers(disponibili.map(a => a.nome));

      setTimeout(() => {
        setMessages(prev => [...prev, { text: messaggioOutput, isUser: false }]);
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 500);

      setInputText("");
    } catch (error) {
      console.error("Errore nella comunicazione:", error);
      setError("Errore imprevisto");
    }
  };


  const formatDriverName = (fullName: string) => {
    const parts = fullName.trim().toLowerCase().split(" ").filter(Boolean);
    if (parts.length < 2) return fullName.replace(/\s/g, "").toLowerCase();

    const [firstName, ...rest] = parts;
    return `${firstName[0]}${rest.join("")}`;
  };

  return (
    <View className="flex-1 bg-white">
      <Header />
      <View className="flex-1 px-4 pt-8">
        <Text className="text-2xl font-bold text-secondary mb-6">
          Chatbot
        </Text>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
          keyboardVerticalOffset={Platform.OS === "ios" ? 130 : 0}
        >
          <View className="flex-1 bg-gray-100 rounded-xl p-4 mb-4">
            <ScrollView
              ref={scrollViewRef}
              className="flex-1"
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
              {messages.map((message, index) => (
                <View
                  key={index}
                  className={`mb-2 p-3 rounded-xl max-w-[80%] ${message.isUser ? "bg-[#0073ff] self-end" : "bg-white self-start"
                    }`}
                >
                  <Text className={message.isUser ? "text-white" : "text-secondary"}>
                    {message.text}
                  </Text>
                  {!message.isUser && index === messages.length - 1 && availableDrivers.length > 0 && (
                    <View className="mt-3">
                      {autistiDisponibili.map((autista, i) => (
                        <TouchableOpacity
                          key={i}
                          className={`px-4 py-2 rounded-xl mb-2 ${selectedDriver === autista.nome ? "bg-green-500" : "bg-[#0073ff]"}`}
                          onPress={async () => {
                            setSelectedDriver(autista.nome);
                            await AsyncStorage.setItem('usernameAutista', autista.nome);
                            await AsyncStorage.setItem('idAutistaUsato', autista.id);
                            router.replace("/partenza");
                          }}
                        >
                          <Text className="text-white text-center">{autista.nome}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                </View>
              ))}
            </ScrollView>
          </View>

          <View className="flex-row mb-6">
            <TextInput
              className="flex-1 border border-gray-300 rounded-xl px-4 py-2 mr-2 bg-white"
              placeholder="Scrivi un messaggio..."
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSendMessage}
            />
            <TouchableOpacity
              className="bg-[#0073ff] rounded-xl px-4 justify-center"
              onPress={handleSendMessage}
            >
              <Text className="text-white font-semibold">Invia</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}