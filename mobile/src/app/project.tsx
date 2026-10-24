import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  StatusBar,
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
import { Ionicons} from "@expo/vector-icons";

const languages = [
  { code: "mm", flag: "🇲🇲", name: "မြန်မာ", sub: "Myanmar" },
  { code: "en", flag: "🇬🇧", name: "English", sub: "English" }
]

type Project = {
  id: number;
  name: string;
  description: string;
  created_at: string;
};


export default function ProjectsScreen() {
const [projects, setProjects] = useState<Project[]>([])
const [modalVisible, setModalVisible] = useState(false);
const [projectName, setProjectName] = useState("");
const [projectDescription, setProjectDescription] = useState("");
const [loading,setLoading] = useState(false)
const [upload,setUpload] = useState(false)
const {t,i18n} = useTranslation();
const [visiabel,setVisiable] = useState(false)

const current = languages.find((item) => item.code === i18n.language);

useEffect(() => {
  getproject()
},[])

const formatDate = (createdAt: string) => {
  const date = new Date(createdAt);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

  const handleCreateProject = async () => {
    const token = await SecureStore.getItemAsync("token")
    if (!projectName.trim()) {
       Toast.show({
         type: "info",
         text1: t("Required"),
         text2: t("Please enter a project name."),
         position: "bottom"
        });
       setModalVisible(false)
       return;
    }

    if (!projectDescription.trim()) {
       Toast.show({
         type: "info",
         text1: t("Required"),
         text2: t("Please enter a project description."),
         position: "bottom"
        });
        setModalVisible(false)
        return;
    }

    setUpload(true)
    try {
      await API.post("/projects", {
        name: projectName,
        description: projectDescription
      },{
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      setModalVisible(false)
      setProjectName("")
      setProjectDescription("")

      Toast.show({
        type: "success",
        text1: t("Project Created"),
        text2: t("Your project has been created successfully!"),
        position: "bottom"
      });
    }
    catch(error : any) {
      const message = error.response?.data
      Toast.show({
        type: "error",
        text1: t("Project Creation Failed"),
        text2: message,
        position: "bottom"
      });
    }
    finally {
      setUpload(false)
    }
  };

  
const getproject = async () => {
  setLoading(true);

  try {
    const token = await SecureStore.getItemAsync("token");

    const response = await API.get("/projects", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const sortedProjects = [...response.data].sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    );

    setProjects(sortedProjects);
  } catch (error: any) {
    Toast.show({
      type: "error",
      text1: t("Failed to Load Projects"),
      text2: t("Unable to fetch projects. Please try again."),
      position: "bottom",
    });
  } finally {
    setLoading(false);
  }
};

  const handleRefresh = () => {
    setLoading(true)
    getproject()
    setLoading(false)
  }

  const handleOpenProject = (
    projectId: string,
    projectName: string,
    projectDescription: string,
  ) => {
    router.push({
      pathname: "/tasks",
      params: { projectId, projectName, projectDescription },
    });
  };

  const renderProject = ({ item }: { item : any }) => (
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

          <Text style={styles.projectDate}>{formatDate(item.created_at)}</Text>
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

        <View style={styles.trigger}>
          <TouchableOpacity onPress={() => setVisiable(true)}>
            <Text style={styles.flag}>{current?.flag}</Text>
          </TouchableOpacity>

          <TouchableOpacity
          onPress={() => router.push("/profile")}
          >
             <Ionicons name="person-circle-outline" size={30} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />

          <Text style={styles.createButtonText}>{t("New Project")}</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>{t("Your Projects")}</Text>

        <FlatList
          data={projects}
          keyExtractor={(item: Project) => item.id.toString()}
          renderItem={renderProject}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="folder-open-outline" size={55} color="#CBD5E1" />

              <Text style={styles.emptyText}>{t("No projects yet")}</Text>

              <Text style={styles.emptySubText}>{t("Create your first project")}</Text>
            </View>
          }
          refreshing={loading}
          onRefresh={handleRefresh}
        />
      </View>

<Modal
  visible={visiabel}
  transparent
  animationType="fade"
  onRequestClose={() => setVisiable(false)}
>
  <Pressable style={styles.overlay} onPress={() => setVisiable(false)}>
    <View style={styles.menu}>
      {languages.map((item) => (
        <Pressable
         key={item.code}
         style={styles.item}
         onPress={() => {
           i18n.changeLanguage(item.code)
           setVisiable(false)
         }}
        >
          <Text style={styles.itemFlag}>{item.flag}</Text>

          <View style={styles.languageText}>
            <Text style={styles.name}>
              {item.name}
            </Text>
            <Text style={styles.sub}>
              {t(item.sub)}
            </Text>
          </View>

          {i18n.language === item.code && 
           (
            <Ionicons name="checkmark" size={24} color="#3976C5"/>
           )
          }
        </Pressable>
      ))}
    </View>
  </Pressable>

</Modal>
      
<Modal
  visible={modalVisible}
  transparent
  animationType="fade"
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>{t("Create Project")}</Text>

        <TouchableOpacity
          onPress={() => setModalVisible(false)}
        >
          <Ionicons name="close" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>{t("Project Name")}</Text>
      <TextInput
        style={styles.modalInput}
        placeholder={t("Enter project name")}
        value={projectName}
        onChangeText={setProjectName}
        maxLength={100}
      />

      <Text style={styles.label}>{t("Description")}</Text>
      <TextInput
        style={[styles.modalInput, styles.descriptionInput]}
        placeholder={t("Enter project description")}
        value={projectDescription}
        onChangeText={setProjectDescription}
        multiline
        maxLength={500}
        textAlignVertical="top"
      />

      <View style={styles.modalButtons}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => {handleCreateProject()}}
        >
          {upload? <ActivityIndicator size={"small"} color={"white"}/> : <Text style={styles.createButtonText}>{t("Create Project")}</Text> }
        </TouchableOpacity>
      </View>
    </View>
  </View>
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
    justifyContent: "space-between"
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
    
  },

  projectDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: "#64748B",
    marginBottom: 5,
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

  modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.45)",
  justifyContent: "center",
  alignItems: "center",
  padding: 20,
},

modalContainer: {
  width: "100%",
  maxWidth: 420,
  backgroundColor: "#FFFFFF",
  borderRadius: 20,
  padding: 20,
},

modalHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 24,
},

modalTitle: {
  fontSize: 20,
  fontWeight: "700",
  color: "#111827",
},

label: {
  fontSize: 14,
  fontWeight: "600",
  color: "#374151",
  marginBottom: 8,
},

modalInput: {
  borderWidth: 1,
  borderColor: "#E5E7EB",
  borderRadius: 10,
  paddingHorizontal: 12,
  paddingVertical: 12,
  fontSize: 15,
  marginBottom: 18,
  color: "#111827",
},

descriptionInput: {
  height: 120,
},

modalButtons: {
  marginTop: 4,
},

cancelButton: {
  paddingHorizontal: 16,
  paddingVertical: 12,
  borderRadius: 10,
  backgroundColor: "#F3F4F6",
},

cancelButtonText: {
  color: "#374151",
  fontWeight: "600",
},

addButton: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  backgroundColor: "#4F46E5",
  paddingHorizontal: 14,
  paddingVertical: 10,
  borderRadius: 10,
},

addButtonText: {
  color: "#FFFFFF",
  fontWeight: "600",
},

trigger: {
  flexDirection: "row",
  alignItems: "center",
  gap: 10,
},

flag: { 
  fontSize: 21
},
  
overlay: {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0,0,0,0.08)",
},
 
menu: {
  width: 280,
  backgroundColor: "#FFFFFF",
  borderRadius: 20,
  paddingVertical: 8,
  paddingHorizontal: 12,
  elevation: 10,
  shadowColor: "#000",
  shadowOpacity: 0.12,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
},
  
item: {
  minHeight: 78,
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 6,
  gap: 12,
},
 
itemFlag: { 
  fontSize: 23 
},
  
languageText: { 
  flex: 1, 
  gap: 3 
},
 
name: {
  fontSize: 18,
  color: "#6B7280",
},
  
sub: {
  fontSize: 12,
  color: "#9CA3AF",
},
});
