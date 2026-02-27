import { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import { useContext } from "react";
import { ThemeContext } from "../ThemeContext/themecontext";

export default function MapScreen() {
  const [region, setRegion] = useState<Region | null>(null);
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const { dark } = useContext(ThemeContext);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    const location = await Location.getCurrentPositionAsync({});
    const coords: Region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };

    setRegion(coords);
    fetchWeather(coords.latitude, coords.longitude);
  };

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const res = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
      );
      setWeather(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const searchLocation = async () => {
    const result = await Location.geocodeAsync(search);
    if (result.length > 0) {
      const coords: Region = {
        latitude: result[0].latitude,
        longitude: result[0].longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

      setRegion(coords);
      fetchWeather(coords.latitude, coords.longitude);
    }
  };

  if (!region) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <View
  style={[
    styles.container,
    { backgroundColor: dark ? "#121212" : "#fff" }
  ]}
>
      <TextInput
        style={styles.search}
        placeholder="Search city..."
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={searchLocation}
      />

      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        <Marker coordinate={region} />
      </MapView>

      {weather && (
        <View style={styles.card}>
          <Text style={styles.temp}>
            Current: {weather.current_weather.temperature}°C
            </Text>

          {weather.daily.time.slice(0, 7).map((day: string, index: number) => (
            <Text key={index}>
              {day} → {weather.daily.temperature_2m_max[index]}° /{" "}
              {weather.daily.temperature_2m_min[index]}°
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  search: {
    position: "absolute",
    top: 50,
    left: 10,
    right: 10,
    zIndex: 1,
    backgroundColor:"white",
    padding: 10,
    borderRadius: 10,
  },
  card: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: dark ? "#1e1e1e" : "white",
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
  },
  temp: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

