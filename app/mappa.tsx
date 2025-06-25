import * as Location from 'expo-location';
import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

type State = {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
};

export default class Mappa extends Component<{}, State> {
  constructor(props: {}) {
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
    const { latitude, longitude } = this.state;
    return (
      <View style={styles.container}>
        {latitude && longitude ? (
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
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
