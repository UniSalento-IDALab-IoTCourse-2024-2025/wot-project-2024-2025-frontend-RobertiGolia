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
  const invokeURL = 'https://nci92kc6ri.execute-api.us-east-1.amazonaws.com/dev'
  const [autistiDisponibili, setAutistiDisponibili] = useState<string[]>([]);

  const [error, setError] = useState('');
  const [output, setOutput] = useState('');


  const handleSendMessage = async () => {
    try {
      setMessages(prev => [...prev, { text: inputText, isUser: true }]);

      const response = await fetch(invokeURL + "/run-model/" + inputText, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      
      if (!response.ok) {
        console.log('ricevuto HTTP status ' + response.status)
        setError('Credenziali non valide');
        return;
      }
      
      const data = await response.json();
      const driversList = data?.output?.drivers || [];

      const disponibili: string[] = [];

      for (let i = 0; i < driversList.length-1; i++) {
        const formatted = formatDriverName(driversList[i]);
        const getAutista = await fetch(invokeURL + "/username/" + formatted, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        console.log(getAutista)
        if (!getAutista.ok) {
          console.log('ricevuto HTTP status ' + getAutista.status);
          setError('Credenziali non valide');
          continue;
        }
        const autista = await getAutista.json();
        console.log(autista)
        const { disponibile } = autista;

        if (disponibile) {
          disponibili.push(formatted);
        }
      }

      console.log("Autisti disponibili: " + disponibili.join(", "));
      setAutistiDisponibili(disponibili);

      if (disponibili.length > 0) {
        setAvailableDrivers(disponibili);
        setOutput("Seleziona un autista tra quelli disponibili:");
      } else {
        setAvailableDrivers([]);
        setOutput("Nessun autista disponibile.");
      }

      setTimeout(() => {
        setMessages(prev => [...prev, { text: output, isUser: false }]);
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 500);

      setInputText("");

    } catch (error) {
      console.error("Errore durante la trasmissione/ricezione:", error);
    }
  };


  const formatDriverName = (fullName: string) => {
    const parts = fullName.trim().toLowerCase().split(" ");
    if (parts.length < 2) return fullName.toLowerCase().replace(/\s/g, "");
    const initial = parts[0][0];
    const lastName = parts.slice(1).join("");

    return `${initial}${lastName}`;
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
                      {availableDrivers.map((driver, i) => {
                        const formatted = formatDriverName(driver);
                        console.log("Driver formattato:", formatted);
                        return (
                          <TouchableOpacity
                            key={i}
                            className={`px-4 py-2 rounded-xl mb-2 ${selectedDriver === formatted ? "bg-green-500" : "bg-[#0073ff]"}`}
                            onPress={async () => {
                              setSelectedDriver(formatted);
                              await AsyncStorage.setItem('usernameAutista', formatted);
                              router.replace("/partenza");
                            }}
                          >
                            <Text className="text-white text-center">{formatted}</Text>
                          </TouchableOpacity>
                        );
                      })}

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