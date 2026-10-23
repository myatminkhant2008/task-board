
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store"
import { API } from "../../api";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";

export default function ProfileScreen() {
  const [name,setName] = useState("...")
  const [email,setEmail] = useState("...")
  const [createdAt,setCreatedAt] = useState("")
  const {t} = useTranslation();
  
  useEffect(() => {
    getUser();
  },[])

  const formatDate = (createdAt: string) => {
    const date = new Date(createdAt);

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
};

  const getUser = async () => {
    const token = await SecureStore.getItemAsync("token")
    try {
      const response = await API.get("/users/me" , {
        headers: {
          "Authorization" : `Bearer ${token}`
        }
      })

      setName(response.data.name)
      setEmail(response.data.email)
      setCreatedAt(response.data.created_at)
    }
    catch(error : any) {
      Toast.show({
        type: "error",
        text1: t("Failed to Load Profile"),
        text2: t("Unable to fetch your profile. Please try again."),
        position: "bottom"
      });
    }
  }

  const handleLogout = () => {
    Alert.alert(
      t("Log Out"),
      t("Are you sure you want to log out?"),
      [
        {
          text: t("Cancel"),
          style: "cancel",
        },
        {
          text: t("Log Out"),
          style: "destructive",
          onPress: async () => {
            await SecureStore.deleteItemAsync("token")
            router.replace("/login");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>

          <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    activeOpacity={0.7}
                  >
                <Ionicons
                      name="arrow-back"
                      size={26}
                      color="#111827"
                />
        </TouchableOpacity>

          <Text style={styles.headerTitle}>{t("My Profile")}</Text>

        </View>

        <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{name.charAt(0)}</Text>
          </View>

          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userEmail}>{email}</Text>

          <View style={styles.roleBadge}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color="#2563EB"
            />
            <Text style={styles.roleText}>{formatDate(createdAt)}</Text>
          </View>

          <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons
            name="log-out-outline"
            size={22}
            color="#DC2626"
          />
          <Text style={styles.logoutText}>{t("Log Out")}</Text>
        </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>
          Task Board · Version 1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  scrollContent: {
    paddingHorizontal: 22,
    paddingBottom: 35,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },

  backButton: {
    width: 34,
    height: 42,
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },

  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 20,
    height: 350
  },

  avatarContainer: {
    width: 94,
    height: 94,
    borderRadius: 47,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#EFF6FF",
  },

  avatarText: {
    fontSize: 38,
    fontWeight: "700",
    color: "#2563EB",
  },

  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 16,
    textAlign: "center",
  },

  userEmail: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 7,
  },

  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    marginTop: 14,
  },

  roleText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2563EB",
  },

  logoutButton: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#FECACA",
    backgroundColor: "#FEF2F2",
    borderRadius: 15,
    width: "100%"
  },

  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#DC2626",
  },

  versionText: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 22,
  },
});
