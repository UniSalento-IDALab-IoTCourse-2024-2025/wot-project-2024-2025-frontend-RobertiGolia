import { Alert, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import Header from "../components/Header";
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useState } from 'react';
import { router } from 'expo-router';

const ScanScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const handleBarCodeScanned = (scanningResult: BarcodeScanningResult) => {
    setScanned(true);
    if (scanningResult.data) {
        try {
          const data = JSON.parse(scanningResult.data);
          console.log("id:", data.id);
          console.log("username:", data.username);
          console.log("nome:", data.nome)
          console.log("cognome:", data.cognome)
          Alert.alert(
            "Autista",
            `ID: ${data.id}\nUsername: ${data.username}\nNome: ${data.nome}\nCognome: ${data.cognome}`
          );
        } catch (e) {
          Alert.alert("Errore", "Il QR code non contiene un JSON valido");
        }
        
    }
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Abbiamo bisogno del tuo permesso per mostrare la fotocamera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}><Text style={styles.buttonText}>Concedi permesso</Text></TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>
        Scannerizza il codice QR che troverai a bordo del veicolo
      </Text>
      <View style={styles.cameraContainer}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.camera}
        />
      </View>
      {scanned && <TouchableOpacity style={styles.button} onPress={() => setScanned(false)}><Text style={styles.buttonText}>Tocca per scansionare di nuovo</Text></TouchableOpacity>}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        color: '#003366', // secondary color
        marginVertical: 20,
        paddingHorizontal: 20,
    },
    cameraContainer: {
        width: 300,
        height: 300,
        alignSelf: 'center',
        marginVertical: 20,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#003366', // secondary color
    },
    camera: {
        flex: 1,
    },
    button: {
        backgroundColor: '#FFD700', // primary color
        padding: 15,
        borderRadius: 10,
        margin: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#003366', // secondary color
        fontSize: 16,
        fontWeight: 'bold',
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
    },
    permissionText: {
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 20,
        color: '#003366',
    }
})

export default ScanScreen;


