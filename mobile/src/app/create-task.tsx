
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store"
import { API } from "../../api";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";

type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

const priorityOptions: TaskPriority[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
];

const priorityLabels: Record<TaskPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

const priorityColors: Record<TaskPriority, string> = {
  LOW: "#16A34A",
  MEDIUM: "#D97706",
  HIGH: "#DC2626",
};

export default function CreateTaskScreen() {
    
  const params = useLocalSearchParams<{
    type: string,
    projectId: string,
    taskId: string,
    status: string,
  }>();

  const isCreate = params.type === "create";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const taskId = params.taskId;
  const projectId = params.projectId;
  const [showPriorityOptions, setShowPriorityOptions] = useState(false);
  const [loading,setLoading] = useState(false)
  const {t} = useTranslation();

  useEffect(() => {
    getTask();
  },[])

  const getTask = async () => {
    
  if (isCreate) {
    setTitle("");
    setDescription("");
    setPriority("MEDIUM");
    setDueDate("");
    return;
  }

  try {
    const token = await SecureStore.getItemAsync("token")
    const response = await API.get(`/tasks/${taskId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })

    const data = response.data;

    setTitle(data.title);
    setDescription(data.description);
    setPriority(data.priority);
    setDueDate(data.due_date)
  }
  catch(error : any) {
    Toast.show({
      type: "error",
      text1: t("Failed to Load Task"),
      text2: t("Unable to fetch task. Please try again."),
      position: "bottom"
    });
  }

};
  
  const handleSave = async () => {
    if (!title.trim()) {
      Toast.show({
          type: "info",
          text1: t("Required"),
          text2: t("Please enter a task title."),
          position: "bottom"
      });
      return;
    }

    if (!description.trim()) {
      Toast.show({
          type: "info",
          text1: t("Required"),
          text2: t("Please enter a description."),
          position: "bottom"
      });
      return;
    }

    if (!dueDate.trim()) {
      Toast.show({
          type: "info",
          text1: t("Required"),
          text2: t("Please enter a due date."),
          position: "bottom"
      });
      return;
    }

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!datePattern.test(dueDate)) {
      Toast.show({
          type: "info",
          text1: t("Invalid Date"),
          text2: t("Please use YYYY-MM-DD format."),
          position: "bottom"
      });
      return;
    }

    if(isCreate) {
       setLoading(true)
       try {
        const token = await SecureStore.getItemAsync("token")
        await API.post(`/projects/${projectId}/tasks`, {
          title: title,
          description: description,
          priority: priority,
          due_date: dueDate
        }, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        Toast.show({
          type: "success",
          text1: t("Task Created"),
          text2: t("Task has been created successfully."),
          position: "bottom"
        });

        router.back();
       }
       catch (error : any) {
        const message = error.response?.data
         Toast.show({
           type: "error",
           text1: t("Creation Failed"),
           text2: message,
           position: "bottom"
         });
       }
       finally {
        setLoading(false)
       }
    }
    else {
      setLoading(true)
       try {
        const token = await SecureStore.getItemAsync("token")
        await API.put(`/tasks/${taskId}`, {
          title: title,
          description: description,
          priority: priority,
          due_date: dueDate
        }, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        Toast.show({
          type: "success",
          text1: t("Task Updated"),
          text2: t("Task has been updated successfully."),
          position: "bottom"
       });

        router.back();
       }
       catch (error : any) {
         const message = error.response?.data
         Toast.show({
           type: "error",
           text1: t("Update Failed"),
           text2: message,
           position: "bottom"
         });
       }
       finally {
        setLoading(false)
       }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <SafeAreaView
        style={styles.safeArea}
        edges={["top"]}
      >
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

          <Text style={styles.headerTitle}>
            {isCreate? t("Create Task") : t("Edit Task")}
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <Text style={styles.label}>{t("Title")}</Text>

          <TextInput
            style={styles.input}
            placeholder={t("Enter task title")}
            placeholderTextColor="#9CA3AF"
            value={title}
            onChangeText={setTitle}
            returnKeyType="next"
          />

          <Text style={styles.label}>{t("Description")}</Text>

          <TextInput
            style={[
              styles.input,
              styles.descriptionInput,
            ]}
            placeholder={t("Enter task description")}
            placeholderTextColor="#9CA3AF"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />

          <Text style={styles.label}>{t("Priority")}</Text>

          <TouchableOpacity
            style={styles.selectInput}
            onPress={() =>
              setShowPriorityOptions(!showPriorityOptions)
            }
            activeOpacity={0.7}
          >
            <View style={styles.selectLeft}>
              <Ionicons
                name="flag-outline"
                size={21}
                color={priorityColors[priority]}
              />

              <Text style={styles.selectText}>
                {t(priorityLabels[priority])}
              </Text>
            </View>

            <Ionicons
              name={
                showPriorityOptions
                  ? "chevron-up"
                  : "chevron-down"
              }
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>

          {showPriorityOptions && (
            <View style={styles.optionsContainer}>
              {priorityOptions.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.option}
                  onPress={() => {
                    setPriority(item);
                    setShowPriorityOptions(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color:
                          priorityColors[item]
                          },
                    ]}
                  >
                    {t(priorityLabels[item])}
                  </Text>

                  {priority === item && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color="#2563EB"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.label}>{t("Due Date")}</Text>

          <View style={styles.dateInput}>
            <Ionicons
              name="calendar-outline"
              size={21}
              color="#6B7280"
            />

            <TextInput
              style={styles.dateTextInput}
              placeholder={t("YYYY-MM-DD")}
              placeholderTextColor="#9CA3AF"
              value={dueDate}
              onChangeText={setDueDate}
              keyboardType="numbers-and-punctuation"
              returnKeyType="done"
            />
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            {loading? <ActivityIndicator size={"small"} color={"white"}/> : 
            <Text style={styles.saveButtonText}>
              {isCreate? t("Save") : t("Save Changes")}
            </Text>}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  safeArea: {
    flex: 1,
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

  scrollView: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 60,
  },

  label: {
    fontSize: 17,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 10,
    marginTop: 22,
  },

  input: {
    minHeight: 58,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    fontSize: 17,
    color: "#111827",
  },

  descriptionInput: {
    height: 125,
    paddingTop: 16,
  },

  selectInput: {
    height: 58,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  selectText: {
    fontSize: 17,
    color: "#374151",
  },

  optionsContainer: {
    marginTop: 8,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },

  option: {
    minHeight: 48,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  optionText: {
    fontSize: 16,
    fontWeight: "500",
  },

  dateInput: {
    height: 58,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  dateTextInput: {
    flex: 1,
    fontSize: 17,
    color: "#111827",
  },

  saveButton: {
    height: 60,
    marginTop: 34,
    borderRadius: 16,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "700",
  },
});
