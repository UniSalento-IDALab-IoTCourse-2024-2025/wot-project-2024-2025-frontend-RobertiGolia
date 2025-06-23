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
  const invokeURL = 'https://nci92kc6ri.execute-api.us-east-1.amazonaws.com/dev'
  const [error, setError] = useState('');
  const [output, setOutput] = useState('');


  const handleSendMessage = async () => {
    try {
      // Aggiungo il messaggio dell'utente alla chat
      setMessages(prev => [...prev, { text: inputText, isUser: true }]);
      
      //Chiamata API
      const response = await fetch(invokeURL + "/run-model/" + inputText, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        console.log('ricevuto HTTP status ' + response.status)
        setError('Credenziali non valide')
      }
      const data = await response.json();
      const { output } = data;
      setOutput(output);
      await AsyncStorage.setItem('usernameAutista', output)

      setTimeout(() => {
        setMessages(prev => [...prev, { text: output, isUser: false }]);
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 500);
      
      setInputText("");



    } catch (error) {
      console.error("Errore durante il login:", error);
    }
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
                  className={`mb-2 p-3 rounded-xl max-w-[80%] ${
                    message.isUser ? "bg-[#0073ff] self-end" : "bg-white self-start"
                  }`}
                >
                  <Text className={message.isUser ? "text-white" : "text-secondary"}>
                    {message.text}
                  </Text>
                  {!message.isUser && (
                    <TouchableOpacity 
                      className="mt-2 bg-[#0073ff] rounded-lg px-3 py-1 self-end"
                      onPress={() => router.replace("/partenza")}
                    >
                      <Text className="text-white text-sm">Continua</Text>
                    </TouchableOpacity>
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