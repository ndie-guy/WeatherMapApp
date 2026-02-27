import { Drawer } from "expo-router/drawer";
import { ThemeProvider } from "../ThemeContext/themecontext";

export default function Layout() {
  return (
    <ThemeProvider>
      <Drawer>
        <Drawer.Screen name="map" options={{ title: "Map" }} />
        <Drawer.Screen name="settings" options={{ title: "Settings" }} />
      </Drawer>
    </ThemeProvider>
  );
}