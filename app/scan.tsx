import { Alert, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import Header from "../components/Header";
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useState, useRef } from 'react';
import { router } from 'expo-router';
import * as MailComposer from 'expo-mail-composer';
import AsyncStorage from '@react-native-async-storage/async-storage';


const ScanScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [nomeAutista, setNomeAutista] = useState('')
  const [cognomeAutista, setCognomeAutista] = useState('')
  const [usernameAutista, setUsernameAutista] = useState('')
  const [idAutista, setIdAutista] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState('');

  const scanning = useRef(false); // flag persistente per bloccare scansioni multiple
  const invokeURL = 'https://nci92kc6ri.execute-api.us-east-1.amazonaws.com/dev'

  const handleBarCodeScanned = async (scanningResult: BarcodeScanningResult) => {
    if (scanning.current) return;

    scanning.current = true;

    try {
      console.log("Raw data:", scanningResult.data);
      console.log("Data type:", typeof scanningResult.data);
      const cleanData = scanningResult.data.trim();
      const data = JSON.parse(cleanData);

      setUsernameAutista(data.username)
      setNomeAutista(data.nome)
      setCognomeAutista(data.cognome)
      setIdAutista(data.id)

      console.log(`È stato scansionato un codice QR:\n\nID: ${data.id}\nUsername: ${data.username}\nNome: ${data.nome}\nCognome: ${data.cognome}`)
      // dentro handleBarCodeScanned
      handleSendEmail(nomeAutista);

      Alert.alert(
        "Autista",
        `ID: ${data.id}\nUsername: ${data.username}\nNome: ${data.nome}\nCognome: ${data.cognome}`,
        [
          {
            text: "OK",
            onPress: () => {
              setScanned(true);
              scanning.current = false;
              router.replace("/mappa");
            },
          },
        ],
        { cancelable: false }
      );
    } catch (e) {
      console.log("Errore nel parsing JSON:", e);
      Alert.alert("Errore", "Il QR code non contiene un JSON valido");
      scanning.current = false;
      setScanned(false);
    }
  };

  const handleSendEmail = async (nomeAutista: string) => {
    try {
      const email = await AsyncStorage.getItem('email_parente');
      console.log(email)
      const emailDto = {
        email: email,
        subject: "Corsa iniziata",
        body: "Gentile " + email + ", la informiamo che è iniziata la corsa"
      };

      const response = await fetch(invokeURL + "/api/trip/sendEmail", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailDto)
      });

      if (!response.ok) {
        console.log('ricevuto HTTP status ' + response.status)
        setError('Errore durante l’invio dell’email');
        return;
      }

      const data = await response.json();
      console.log(data)
      console.log("Email inviata:", data.message);

    } catch (error) {
      console.error("Errore durante la trasmissione/ricezione:", error);
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


