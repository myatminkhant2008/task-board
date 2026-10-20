
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
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
  }>();

  const isCreate = params.type === "create";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const taskId = params.taskId;
  const projectId = params.projectId;
  const [showPriorityOptions, setShowPriorityOptions] = useState(false);

  useEffect(() => {
    getTask();
  },[])

  const getTask = () => {
    
  if (isCreate) {
    setTitle("");
    setDescription("");
    setPriority("MEDIUM");
    setDueDate("");
    return;
  }

};
  

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert("Required", "Please enter a task title.");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Required", "Please enter a description.");
      return;
    }

    if (!dueDate.trim()) {
      Alert.alert("Required", "Please enter a due date.");
      return;
    }

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!datePattern.test(dueDate)) {
      Alert.alert(
        "Invalid Date",
        "Please use YYYY-MM-DD format."
      );
      return;
    }

    if(isCreate) {
        Alert.alert("Success", "Task saved successfully.", [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ]);
    }
    else {
        Alert.alert("Success", "Task edit saved successfully.", [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ]);
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
            {isCreate? "Create Task" : "Edit Task"}
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <Text style={styles.label}>Title</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your title"
            placeholderTextColor="#9CA3AF"
            value={title}
            onChangeText={setTitle}
            returnKeyType="next"
          />

          <Text style={styles.label}>Description</Text>

          <TextInput
            style={[
              styles.input,
              styles.descriptionInput,
            ]}
            placeholder="Enter your description"
            placeholderTextColor="#9CA3AF"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />

          <Text style={styles.label}>Priority</Text>

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
                {priorityLabels[priority]}
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
                    {priorityLabels[item]}
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

          <Text style={styles.label}>Due Date</Text>

          <View style={styles.dateInput}>
            <Ionicons
              name="calendar-outline"
              size={21}
              color="#6B7280"
            />

            <TextInput
              style={styles.dateTextInput}
              placeholder="YYYY-MM-DD"
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
            <Text style={styles.saveButtonText}>
              {isCreate? "Save" : "Save Changes"}
            </Text>
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
