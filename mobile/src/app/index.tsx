import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/register");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.body}>
      <Text style={styles.text}>Task Board</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    fontSize: 30,
  },
});
