import { useColorScheme } from "react-native";

import { Colors } from "@/constants/theme";
import { Stack } from "expo-router";

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "dark" ? "dark" : "light"];

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        animationDuration: 100,
        contentStyle: {
          backgroundColor: "#F8F8F8",
        },
      }}
    >
      <Stack.Screen name="index" />

      <Stack.Screen name="project" />

      <Stack.Screen name="login" />
      
      <Stack.Screen name="register" />

      <Stack.Screen name="tasks" />
    </Stack>
  );
}
