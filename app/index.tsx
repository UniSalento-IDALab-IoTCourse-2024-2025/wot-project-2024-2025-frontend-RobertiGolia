import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function SelectRole() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      <Text className="text-3xl font-bold text-secondary mb-12">
        Benvenuto in Taxi Sociale
      </Text>
      
      <View className="w-full space-y-4 gap-4">
        <TouchableOpacity
          onPress={() => router.replace('/(auth)/login')}
          className="w-full bg-[#0073ff] py-4 rounded-xl items-center"
        >
          <Text className="text-white text-lg font-semibold">
            Sono un Cliente
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(auth)/driver-login')}
          className="w-full border-2 border-[#0073ff] py-4 rounded-xl items-center"
        >
          <Text className="text-[#0073ff] text-lg font-semibold">
            Sono un Autista
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 