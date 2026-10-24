import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import { I18nextProvider } from "react-i18next";
import Toast from "react-native-toast-message";

import i18n from "../../lib/i18n";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider
      value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <I18nextProvider i18n={i18n}>
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
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="project" />
          <Stack.Screen name="tasks" />
          <Stack.Screen name="task-detail" />
          <Stack.Screen name="create-task" />
          <Stack.Screen name="profile" />
        </Stack>
        <Toast />
      </I18nextProvider>
    </ThemeProvider>
  );
}