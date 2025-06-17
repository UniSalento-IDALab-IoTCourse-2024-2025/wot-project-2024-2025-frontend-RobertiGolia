import { useRouter } from 'expo-router';
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Header from "../../components/Header";
import { PREDEFINED_LOCATIONS } from "../../constants/locations";

export default function Index() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <Header />
      <View className="flex-1 px-6 pt-8">
        <Text className="text-2xl font-bold text-secondary mb-8">
          Dove vuoi andare?
        </Text>

        <View className="space-y-4 mb-8">
          <View>
            <Text className="text-secondary mb-2">Partenza</Text>
            <TextInput
              className="w-full bg-gray-100 rounded-xl px-4 py-3"
              placeholder="Inserisci il punto di partenza"
              defaultValue={PREDEFINED_LOCATIONS.partenza}
              editable={false}
            />
          </View>

          <View>
            <Text className="text-secondary mb-2">Arrivo</Text>
            <TextInput
              className="w-full bg-gray-100 rounded-xl px-4 py-3"
              placeholder="Inserisci la destinazione"
              defaultValue={PREDEFINED_LOCATIONS.arrivo}
              editable={false}
            />
          </View>

          <View>
            <Text className="text-secondary mb-2">Orario di partenza</Text>
            <TextInput
              className="w-full bg-gray-100 rounded-xl px-4 py-3"
              placeholder="Inserisci l'orario"
              defaultValue={PREDEFINED_LOCATIONS.orario}
              editable={false}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.replace('/corse')}
          className="w-full bg-[#0073ff] py-4 rounded-xl items-center"
        >
          <Text className="text-white text-lg font-semibold">
            Continua
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
