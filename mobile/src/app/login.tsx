import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { API } from "../../api";
import * as SecureStore from "expo-secure-store"
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading,setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email.trim()) {
          Toast.show({
             type: "info",
             text1: "Required",
             text2: "Please enter your email.",
             position: "bottom"
          });
         return;
    }

    if (!password.trim()) {
          Toast.show({
             type: "info",
             text1: "Required",
             text2: "Please enter your password.",
             position: "bottom"
          });
         return;
    }

    setLoading(true)
    try {
      const response = await API.post("/auth/login",{
        email: email,
        password_hash: password
      })
      const token = response.data.token
      await SecureStore.setItemAsync("token",token);

      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: "Welcome back!",
        position: "bottom"
      });

      router.replace("/project")
    }
    catch (error: any) {
    const message = error.response?.data;

    Toast.show({
      type: "error",
      text1: "Login Failed",
      text2: message,
      position: "bottom"
    });
    
    }
    finally {
      setLoading(false)
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.form}>
        <Text style={styles.title}>Welcome Back</Text>

        <Text style={styles.subtitle}>Log in to manage your projects and tasks.</Text>

        <Text style={styles.label}>Email</Text>

        <TextInput
          style={styles.input}
          placeholder="you@gmail.com"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          {loading? <ActivityIndicator size={"small"} color="white"/> : <Text style={styles.buttonText}>Login</Text> }
          
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.link}>
            Don't have an account?{" "}
            <Text style={styles.linkBold}>Create Account</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  form: {
    width: "100%",
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginBottom: 36,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },

  input: {
    height: 54,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 20,
    color: "#111827",
  },

  button: {
    height: 54,
    backgroundColor: "#2563EB",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  link: {
    textAlign: "center",
    marginTop: 24,
    fontSize: 14,
    color: "#6B7280",
  },

  linkBold: {
    color: "#2563EB",
    fontWeight: "600",
  },
});
