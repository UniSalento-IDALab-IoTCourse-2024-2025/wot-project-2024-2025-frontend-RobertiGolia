import * as Location from 'expo-location';
import React, { Component } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { NavigationProp } from "@react-navigation/native";
import { router } from 'expo-router';

type Props = {
  navigation: NavigationProp<any>;
};

type State = {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
};

export default class Mappa extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      latitude: null,
      longitude: null,
      error: null
    };
  }

  async componentDidMount() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      this.setState({ error: 'Permesso per la posizione negato' });
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  }

  render() {
    const { latitude, longitude, error } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Button title="Torna indietro" onPress={() => router.replace('/(tabs)/ride-booked')} />
        </View>
        {error ? (
          <Text>{error}</Text>
        ) : latitude && longitude ? (
          <MapView
            style={styles.map}
            region={{
              latitude,
              longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121
            }}
          >
            <Marker coordinate={{ latitude, longitude }} />
          </MapView>
        ) : (
          <Text>Caricamento mappa...</Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 50,
    zIndex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    elevation: 5,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
