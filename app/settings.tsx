import { View, Text, Switch, StyleSheet } from "react-native";
import { useContext } from "react";
import { ThemeContext } from "../ThemeContext/themecontext";

export default function Settings() {
  const { dark, toggleTheme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: dark ? "#121212" : "#fff" }]}>
      <Text style={{ color: dark ? "#fff" : "#000", fontSize: 20 }}>
        Dark Mode
      </Text>
      <Switch value={dark} onValueChange={toggleTheme} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});