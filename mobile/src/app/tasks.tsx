import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TaskListScreen() {
  const { projectId, projectName, projectDescription } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.title}>{projectName}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.text}>Project ID: {projectId}</Text>

        <Text style={styles.subtitle}>{projectDescription}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  header: {
    height: 65,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  content: {
    flex: 1,
    padding: 20,
  },

  text: {
    fontSize: 18,
    fontWeight: "600",
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 10,
  },
});
