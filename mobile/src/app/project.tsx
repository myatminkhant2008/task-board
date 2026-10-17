import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export default function ProjectsScreen() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Mobile App",
      description: "Mobile app test ",
      createdAt: "02 Oct 2026",
    },
    {
      id: "2",
      name: "Website",
      description: "Website app test ",
      createdAt: "01 Oct 2026",
    },
    {
      id: "3",
      name: "Marketing",
      description: "Marketing app test ",
      createdAt: "30 Sep 2026",
    },
  ]);

  const handleCreateProject = () => {
    Alert.alert("New Project", "Create Project Screen will be added soon.");
  };

  const handleOpenProject = (
    projectId: string,
    projectName: string,
    projectDescription: string,
  ) => {
    console.log(projectDescription);
    router.push({
      pathname: "/tasks",
      params: { projectId, projectName, projectDescription },
    });
  };

  const renderProject = ({ item }: { item: Project }) => (
    <TouchableOpacity
      style={styles.projectCard}
      onPress={() => handleOpenProject(item.id, item.name, item.description)}
      activeOpacity={0.7}
    >
      <View style={styles.projectIcon}>
        <Ionicons name="folder-outline" size={24} color="#2563EB" />
      </View>

      <View style={styles.projectInfo}>
        <Text style={styles.projectName}>{item.name}</Text>

        <Text style={styles.projectDescription}>{item.description}</Text>

        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />

          <Text style={styles.projectDate}>{item.createdAt}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar barStyle="light-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Task Board</Text>

        <TouchableOpacity
          onPress={() => Alert.alert("Profile", "Profile coming soon")}
        >
          <Ionicons name="person-circle-outline" size={30} color="#374151" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateProject}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />

          <Text style={styles.createButtonText}>New Project</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Your Projects</Text>

        <FlatList
          data={projects}
          keyExtractor={(item) => item.id}
          renderItem={renderProject}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="folder-open-outline" size={55} color="#CBD5E1" />

              <Text style={styles.emptyText}>No projects yet</Text>

              <Text style={styles.emptySubText}>Create your first project</Text>
            </View>
          }
        />
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
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#111827",
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 25,
  },

  createButton: {
    height: 54,
    backgroundColor: "#2563EB",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },

  createButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 8,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },

  list: {
    paddingBottom: 30,
  },

  projectCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  projectIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  projectInfo: {
    flex: 1,
  },

  projectName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 5,
  },

  projectDescription: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  projectDate: {
    fontSize: 13,
    color: "#9CA3AF",
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 100,
  },

  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginTop: 15,
  },

  emptySubText: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 6,
  },
});
