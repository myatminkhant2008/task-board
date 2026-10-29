
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API } from "../../api";
import * as SecureStore from "expo-secure-store"
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";

type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

const statusOptions: TaskStatus[] = [
  "TODO",
  "IN_PROGRESS",
  "DONE",
];

const statusLabels: Record<TaskStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

const statusColors: Record<
  TaskStatus,
  { background: string; text: string; dot: string }
> = {
  TODO: {
    background: "#DBEAFE",
    text: "#1D4ED8",
    dot: "#2563EB",
  },
  IN_PROGRESS: {
    background: "#F3E8FF",
    text: "#7E22CE",
    dot: "#9333EA",
  },
  DONE: {
    background: "#DCFCE7",
    text: "#15803D",
    dot: "#16A34A",
  },
};

const priorityColors: Record<TaskPriority, string> = {
  LOW: "#16A34A",
  MEDIUM: "#D97706",
  HIGH: "#DC2626",
};

export default function TaskDetailScreen() {
  
  const params = useLocalSearchParams<{
    taskId: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    due_date: string;
  }>();

  const [status, setStatus] = useState<TaskStatus>(params.status as TaskStatus);
  const [title,setTitle] = useState(params.title);
  const [description,setDescription] = useState(params.description);
  const [priority,setPriority] = useState<TaskPriority>(params.priority as TaskPriority);
  const [dueDate,setDuedate] = useState(params.due_date)
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
  const [delTask,setDelTask] = useState(false)
  const {t} = useTranslation();

  useFocusEffect(
    useCallback(() => {
      getTask();
    },[])
  )

  const formatDate = (createdAt: string) => {
    const date = new Date(createdAt);

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
     });
  };

  const getTask = async () => {
    try {
      const token = await SecureStore.getItemAsync("token")
      const response = await API.get(`/tasks/${params.taskId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
  
      const data = response.data;
  
      setStatus(data.status as TaskStatus)
      setTitle(data.title)
      setDescription(data.description)
      setPriority(data.priority as TaskPriority)
      setDuedate(data.due_date)
    }
    catch(error : any) {
      Toast.show({
          type: "error",
          text1: t("Failed to Load Tasks"),
          text2: t("Unable to fetch tasks. Please try again."),
          position: "bottom"
      });
    }
  
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    setLoadingStatus(newStatus)
    try {
      const token = await SecureStore.getItemAsync("token")
      await API.patch(`tasks/${params.taskId}/status`, {
        status: newStatus
      },{
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      Toast.show({
        type: "success",
        text1: t("Status Updated"),
        text2: t("Task status has been changed successfully."),
        position: "bottom"
      });

      setStatus(newStatus);
      setShowStatusModal(false);
    }
    catch (error : any) {
      const message = error.response?.data
      Toast.show({
        type: "error",
        text1: t("Update Failed"),
        text2: message,
        position: "bottom"
      });
      setShowStatusModal(false);
    }
    finally {
      setLoadingStatus(null)
    }
  };

  const deleteTask = async () => {
    setDelTask(true)
    try {
      const token = await SecureStore.getItemAsync("token")
      await API.delete(`/tasks/${params.taskId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })

    Toast.show({
       type: "success",
       text1: t("Task Deleted"),
       text2: t("Task has been deleted successfully."),
       position: "bottom"
    });
     router.back();
    }
    catch {
      Toast.show({
        type: "error",
        text1: t("Delete Failed"),
        text2: t("Failed to delete task. Please try again."),
        position: "bottom"
     });
    }
    finally {
      setDelTask(false)
    }
  }

  const handleDelete = () => {
   Alert.alert(
  t("Delete Task"),
  t("Are you sure you want to delete this task?"),
  [
    {
      text: t("Cancel"),
      style: "cancel",
    },
    {
      text: t("Delete"),
      style: "destructive",
      onPress: async () => {
        await deleteTask();
      },
    },
  ]
);
  };

  return (
    <SafeAreaView
          style={styles.container}
          edges={["top", "bottom"]}
        >
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={23} color="#0F172A" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{t("Task Details")}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.topRow}>

            <TouchableOpacity
              style={[
                styles.statusBadge,
                { backgroundColor: statusColors[status].background },
              ]}
              onPress={() => setShowStatusModal(true)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: statusColors[status].dot },
                ]}
              />

              <Text
                style={[
                  styles.statusText,
                  { color: statusColors[status].text },
                ]}
              >
                {t(statusLabels[status])}
              </Text>

              <Ionicons
                name="chevron-down"
                size={15}
                color={statusColors[status].text}
              />
            </TouchableOpacity>

          </View>

          <Text style={styles.taskTitle}>{title}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>{t("Description")}</Text>
          <Text style={styles.description}>{description}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>{t("Priority")}</Text>
          <View style={styles.infoRow}>
            <Ionicons
              name="flag-outline"
              size={20}
              color={priorityColors[priority]}
            />

            <Text
              style={[
                styles.priorityText,
                { color: priorityColors[priority] },
              ]}
            >
              {t(priority.charAt(0) + priority.slice(1).toLowerCase())}
            </Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>{t("Due Date")}</Text>

          <View style={styles.infoRow}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color="#64748B"
            />
            <Text style={styles.infoText}>{formatDate(dueDate)}</Text>
          </View>
              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>{t("Task ID")}</Text>

              <View style={styles.infoRow}>
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color="#64748B"
                />
                <Text style={styles.infoText}>#{params.taskId}</Text>
              </View>
        </View>

        <View style={styles.hintBox}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color="#2563EB"
          />
          <Text style={styles.hintText}>
            {t("Tap the status badge to change the task status.")}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: "/create-task",
              params: {
                taskId: String(params.taskId),
                type: String("edit"),
                status: String(status)
              },
            })
          }
        >
          <Ionicons name="create-outline" size={20} color="#FFFFFF" />
          <Text style={styles.editButtonText}>{t("Edit Task")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          activeOpacity={0.8}
          onPress={handleDelete}
        >
          {delTask? <ActivityIndicator size={20} color="#DC2626" /> : <Ionicons name="trash-outline" size={20} color="#DC2626" /> }
          <Text style={styles.deleteButtonText}>{delTask? t("Deleting") : t("Delete Task")}</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showStatusModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowStatusModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowStatusModal(false)}
        >
          <Pressable
            style={styles.bottomSheet}
            onPress={(event) => event.stopPropagation()}
          >
            <View style={styles.sheetHandle} />

            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>{t("Change Status")}</Text>
                <Text style={styles.modalSubtitle}>
                  {t("Select the current task status")}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowStatusModal(false)}
              >
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            {statusOptions.map((option) => {
              const selected = status === option;
              const colors = statusColors[option];
              const loading = loadingStatus === option;

              return (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.statusOption,
                    selected && styles.selectedStatusOption,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => handleStatusChange(option)}
                >
                  <View
                    style={[
                      styles.optionIcon,
                      { backgroundColor: colors.background },
                    ]}
                  >
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: colors.dot },
                      ]}
                    />
                  </View>

                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>
                      {t(statusLabels[option])}
                    </Text>
                    <Text style={styles.optionDescription}>
                      {option === "TODO"
                        ? t("Task has not started")
                        : option === "IN_PROGRESS"
                        ? t("Task is currently in progress")
                        : t("Task has been completed")}
                    </Text>
                  </View>

                  {loading ? ( <ActivityIndicator size="small" color={colors.dot} />
                 ) : selected ? (
                     <Ionicons
                          name="checkmark-circle"
                          size={23}
                          color={colors.dot}
                     />
                ) : (
                     <View style={styles.unselectedCircle} />
                  )}
                </TouchableOpacity>
              );
            })}

          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
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

  scrollContent: {
    padding: 20,
    paddingBottom: 36,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  topRow: {
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 22,
  },

  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#94A3B8",
    marginBottom: 5
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  statusText: {
    fontSize: 13,
    fontWeight: "700",
  },

  taskTitle: {
    fontSize: 25,
    lineHeight: 33,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
  },

  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 22,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 12,
  },

  description: {
    fontSize: 15,
    lineHeight: 24,
    color: "#64748B",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  priorityText: {
    fontSize: 15,
    fontWeight: "700",
  },

  infoText: {
    fontSize: 15,
    color: "#475569",
    fontWeight: "500",
  },

  hintBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#EFF6FF",
    padding: 14,
    borderRadius: 14,
    marginTop: 18,
    marginBottom: 24,
  },

  hintText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: "#1D4ED8",
  },

  editButton: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    backgroundColor: "#2563EB",
    borderRadius: 14,
    marginBottom: 12,
  },

  editButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  deleteButton: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 14,
  },

  deleteButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#DC2626",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "flex-end",
  },

  bottomSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 30,
  },

  sheetHandle: {
    alignSelf: "center",
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#CBD5E1",
    marginBottom: 22,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  modalTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#0F172A",
  },

  modalSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 5,
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },

  statusOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 15,
    marginBottom: 10,
    gap: 12,
  },

  selectedStatusOption: {
    borderColor: "#93C5FD",
    backgroundColor: "#F8FBFF",
  },
  optionIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  optionTextContainer: {
    flex: 1,
    gap: 4,
  },

  optionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },

  optionDescription: {
    fontSize: 12,
    color: "#64748B",
  },

  unselectedCircle: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 11,
  },
});
