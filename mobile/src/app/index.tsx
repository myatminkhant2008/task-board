import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View, ActivityIndicator, Image } from "react-native";
import * as SecureStore from "expo-secure-store";
import * as Network from "expo-network";
import Toast from "react-native-toast-message";

export default function SplashScreen() {
  useEffect(() => {
    const loadScreen = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const network = await Network.getNetworkStateAsync();

        if (!network.isConnected) {
          Toast.show({
            type: "error",
            text1: "No Internet Connection",
            text2: "Please check your internet connection.",
            position: 'bottom'
          });

          router.replace("/login");
          return;
        }

        const token = await SecureStore.getItemAsync("token");

        if (token === null) {
          router.replace("/login");
          return;
        }

        router.replace("/project");
      } catch (error) {
        router.replace("/login");
      }
    };

    loadScreen();
  }, []);

  return (
    <View style={styles.body}>
      <Image source={require("../../assets/images/app_icon.png")} style={{ width: 150, height: 150 }}/>
      <View style={{flexDirection: 'row',gap: '10'}}>
        <ActivityIndicator size="small" color={"black"} />
        <Text style={styles.text}>Loading ...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },

  text: {
    fontSize: 15,
    fontWeight: "bold",
    color: "black"
  },
});