
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  project_id: string;
  assignee_id: string;
}

const statusFilters = [
  { label: "All", value: "ALL" },
  { label: "To Do", value: "TODO" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Done", value: "DONE" },
];

export default function TaskListScreen() {
  const { projectId, projectName, projectDescription } =
    useLocalSearchParams<{
      projectId: string;
      projectName: string;
      projectDescription: string;
    }>();

  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const [task] = useState<Task[]>([
    {
      id: "1",
      title: "Login Fix",
      description: "Fix login authentication and validation issues.",
      status: "TODO",
      priority: "MEDIUM",
      due_date: "20-10-2026",
      project_id: "1",
      assignee_id: "1",
    },
    {
      id: "2",
      title: "JWT Fix",
      description: "Fix JWT token validation in the backend.",
      status: "IN_PROGRESS",
      priority: "HIGH",
      due_date: "22-10-2026",
      project_id: "1",
      assignee_id: "1",
    },
    {
      id: "3",
      title: "Write Document",
      description: "Write document for project information.",
      status: "DONE",
      priority: "LOW",
      due_date: "18-10-2026",
      project_id: "1",
      assignee_id: "1",
    },
  ]);

  const filteredTasks = task.filter((item) => {
    const keyword = searchText.trim().toLowerCase();

    const matchesSearch =
      item.title.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword);

    const matchesStatus =
      selectedStatus === "ALL" ||
      item.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const renderTask = ({ item }: { item: Task }) => {
    const statusColor =
      item.status === "DONE"
        ? "#059669"
        : item.status === "IN_PROGRESS"
        ? "#7C3AED"
        : "#2563EB";

    const statusBackground =
      item.status === "DONE"
        ? "#D1FAE5"
        : item.status === "IN_PROGRESS"
        ? "#EDE9FE"
        : "#DBEAFE";

    const priorityColor =
      item.priority === "HIGH"
        ? "#DC2626"
        : item.priority === "MEDIUM"
        ? "#D97706"
        : "#059669";

    const priorityBackground =
      item.priority === "HIGH"
        ? "#FEE2E2"
        : item.priority === "MEDIUM"
        ? "#FEF3C7"
        : "#D1FAE5";

    return (
      <TouchableOpacity
        style={[
          styles.taskCard,
          { borderLeftColor: statusColor },
        ]}
        activeOpacity={0.8}
        onPress={() => openTaskDetail(item)}
      >
        <View style={styles.taskHeader}>
          <View style={styles.taskInfo}>
            <Text style={styles.taskTitle}>
              {item.title}
            </Text>

            <Text style={styles.taskDescription}>
              {item.description}
            </Text>
          </View>
        </View>

        <View style={styles.taskFooter}>
          <View style={styles.badges}>
            <View
              style={[
                styles.badge,
                { backgroundColor: statusBackground },
              ]}
            >
              <View
                style={[
                  styles.badgeDot,
                  { backgroundColor: statusColor },
                ]}
              />

              <Text
                style={[
                  styles.badgeText,
                  { color: statusColor },
                ]}
              >
                {item.status === "IN_PROGRESS"
                  ? "IN PROGRESS"
                  : item.status}
              </Text>
            </View>

            <View
              style={[
                styles.badge,
                { backgroundColor: priorityBackground },
              ]}
            >
              <Ionicons
                name="flag"
                size={13}
                color={priorityColor}
              />

              <Text
                style={[
                  styles.badgeText,
                  { color: priorityColor },
                ]}
              >
                {item.priority}
              </Text>
            </View>
          </View>

          <View style={styles.dateRow}>
            <Ionicons
              name="calendar-outline"
              size={15}
              color="#64748B"
            />

            <Text style={styles.projectDate}>
              {item.due_date}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const openTaskDetail = (item: Task) => {
  router.push({
    pathname: "/task-detail",
    params: {
      taskId: item.id,
      title: item.title,
      description: item.description,
      status: item.status,
      priority: item.priority,
      due_date: item.due_date,
    },
  });
};

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#111827"
          />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.title} numberOfLines={1}>
            {projectName}
          </Text>

          <Text
            style={styles.subtitle}
            numberOfLines={1}
          >
            {projectDescription}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            router.push({
              pathname: "/create-task",
              params: {
                projectId: String(projectId),
                type: String("create")
              },
            })
          }
        >
          <Ionicons
            name="add"
            size={25}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color="#94A3B8"
          />

          <TextInput
            style={styles.searchInput}
            placeholder="Search your tasks"
            placeholderTextColor="#94A3B8"
            returnKeyType="search"
            value={searchText}
            onChangeText={setSearchText}
            autoCapitalize="none"
          />

          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchText("")}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color="#94A3B8"
              />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          horizontal
          data={statusFilters}
          keyExtractor={(item) => item.value}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          style={styles.filterContainer}
          renderItem={({ item }) => {
            const isSelected =
              selectedStatus === item.value;

            return (
              <TouchableOpacity
                style={[
                  styles.filterTab,
                  isSelected && styles.activeFilterTab,
                ]}
                onPress={() =>
                  setSelectedStatus(item.value)
                }
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterText,
                    isSelected && styles.activeFilterText,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        <View style={styles.listHeader}>
          <Text style={styles.taskCount}>
            {filteredTasks.length}{" "}
            {filteredTasks.length === 1 ? "task" : "tasks"}
          </Text>
        </View>

        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="clipboard-outline"
                size={42}
                color="#CBD5E1"
              />

              <Text style={styles.emptyText}>
                No tasks found
              </Text>

              <Text style={styles.emptySubtext}>
                Try another search or status filter.
              </Text>
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
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },

  backButton: {
    width: 34,
    height: 42,
    justifyContent: "center",
  },

  headerInfo: {
    flex: 1,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },

  subtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },

  addButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },

  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 12,
  },

  searchBar: {
    height: 50,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },

  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: "#0F172A",
    paddingVertical: 0,
  },

  filterContainer: {
    flexGrow: 0,
    marginBottom: 18,
  },

  filterList: {
    gap: 10,
    paddingRight: 4,
  },

  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },

  activeFilterTab: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },

  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },

  activeFilterText: {
    color: "#FFFFFF",
  },

  listHeader: {
    marginBottom: 14,
  },

  taskCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },

  listContent: {
    paddingBottom: 24,
    flexGrow: 1,
  },

  taskCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#F1F5F9",
    elevation: 2,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },

  taskHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },

  taskInfo: {
    flex: 1,
  },

  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6
  },

  taskDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: "#64748B",
  },

  taskFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 8,
  },

  badges: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    flexShrink: 1,
  },

  badge: {
    minHeight: 32,
    borderRadius: 20,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flexShrink: 0,
  },

  projectDate: {
    fontSize: 11,
    color: "#64748B",
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },

  emptyText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 12,
  },

  emptySubtext: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 6,
    textAlign: "center",
  },
});
