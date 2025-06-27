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
          //qui in replace() inserire la pagina di login
          //onPress={() => router.replace('/(auth)/login')}
          onPress={() => router.replace('/(auth)/login')}
          className="w-full bg-[#0073ff] py-4 rounded-xl items-center"
        >
          <Text className="text-white text-lg font-semibold">
            ENTRA
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 