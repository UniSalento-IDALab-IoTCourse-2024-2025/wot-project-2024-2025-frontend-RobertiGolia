
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import Header from "../components/Header";

const ScanScreen = () => {
  const handleStartRide = () => {
    Alert.alert('Notifica', 'Corsa avviata');
  };

  return (
    <View className="flex-1 bg-white">
      <Header />
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-2xl text-center text-secondary mb-8">
          Stai per partire
        </Text>
        <TouchableOpacity
          onPress={handleStartRide}
          className="bg-[#0073ff] px-6 py-4 rounded-xl"
        >
          <Text className="text-white text-lg font-semibold">
            Inizio corsa
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ScanScreen;


