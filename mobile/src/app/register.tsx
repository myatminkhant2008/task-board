import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { API } from "../../api";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading,setLoading] = useState(false)
  const {t} = useTranslation();

  const handleRegister = async () => {
    if (!name.trim()) {
          Toast.show({
            type: "info",
            text1: t("Required"),
            text2: t("Please enter your name."),
            position: "bottom"
          });
          return;
    }

    if (!email.trim()) {
          Toast.show({
            type: "info",
            text1: t("Required"),
            text2: t("Please enter your email."),
            position: "bottom"
          });
          return;
    }

    if (!password.trim()) {
          Toast.show({
            type: "info",
            text1: t("Required"),
            text2: t("Please enter your password."),
            position: "bottom"
          });
          return;
    }

    if (password.trim().length < 6) {
          Toast.show({
            type: "info",
            text1: t("Invalid Password"),
            text2: t("Password must be at least 6 characters."),
            position: "bottom"
          });
          return;
    }

    setLoading(true)
    try {
      await API.post("/auth/register",{
        name: name,
        email: email,
        password_hash:  password
      })

      Toast.show({
        type: "success",
        text1: t("Sign Up Successful"),
        text2: t("Your account has been created!"),
        position: "bottom"
      });
      router.replace("/login")
    }
    catch (error: any) {
    const message = error.response?.data;
    Toast.show({
      type: "error",
      text1: t("Sign Up Failed"),
      text2: message,
      position: "bottom"
    });
  }
    finally{
      setLoading(false)
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <Text style={styles.title}>{t("Create Account")}</Text>

          <Text style={styles.subtitle}>{t("Sign up to get started.")}</Text>

          <Text style={styles.label}>{t("Name")}</Text>

          <TextInput
            style={styles.input}
            placeholder={t("Enter your name")}
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>{t("Email")}</Text>

          <TextInput
            style={styles.input}
            placeholder="you@gmail.com"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>{t("Password")}</Text>

          <TextInput
            style={styles.input}
            placeholder={t("Enter your password")}
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            {loading? <ActivityIndicator size={"small"} color="white"/> : 
              <Text style={styles.buttonText}>{t("Sign Up")}</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace("/login")}>
            <Text style={styles.link}>
              {t("Already have an account?")}{" "}
              <Text style={styles.linkBold}>{t("Login")}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
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
