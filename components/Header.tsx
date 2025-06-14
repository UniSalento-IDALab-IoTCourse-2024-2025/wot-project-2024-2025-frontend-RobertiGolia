/*
Intestazione presente nella schermata principale con i vari tab
*/

import { Image, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Header = () => {
  return (
    <SafeAreaView className="bg-white">
      <View className="flex-row items-center justify-center h-16 px-4">
        <View className="flex-1 items-center">
          <Image source={require("../assets/images/icon5.png")}  />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Header; 