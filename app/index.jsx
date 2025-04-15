import { MainView, MainViewCard } from "@/components/MainView";
import { ThemedButton } from "@/components/ThemedButton";
import ThemedText from "@/components/ThemedText";
import useColor from "@/hook/useColor";
import { Link } from "expo-router";
import { useState, useEffect } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Card from "@/components/Card";
import { useRouter } from "expo-router";

const colors = useColor();

export default function Index() {
  const router = useRouter();
  const [listName, setListName] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardVisible(true);
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView 
          contentContainerStyle={[
            styles.scrollViewContent,
            keyboardVisible && { paddingBottom: keyboardHeight + 20 }
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <ThemedText color="primary" variant="heading1" style={styles.headerTitle}>
              Courseo
            </ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              Organisez vos courses en toute simplicité
            </ThemedText>
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            <Card style={styles.card}>
              <View style={styles.cardContent}>
                <ThemedText variant="heading2" style={styles.title}>
                  Nouvelle Liste
                </ThemedText>

                {!keyboardVisible && (
                  <Image
                    source={require("@/assets/images/courseo-home-ill.png")}
                    style={styles.image}
                  />
                )}

                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="list-outline" size={20} color={colors.grayLight} style={styles.inputIcon} />
                    <TextInput
                      placeholderTextColor={colors.grayLight}
                      placeholder="Nom de la liste"
                      value={listName}
                      onChangeText={setListName}
                      style={styles.listeNameInput}
                    />
                  </View>

                  <Link
                    href={{
                      pathname: "/list/[list]",
                      params: { listName: listName || "Liste sans nom" },
                    }}
                    asChild
                  >
                    <Pressable disabled={!listName.trim()}>
                      <ThemedButton
                        style={[
                          styles.button,
                          !listName.trim() && { opacity: 0.5 },
                        ]}
                      >
                        <View style={styles.buttonContent}>
                          <Ionicons name="add-circle-outline" size={20} color="white" />
                          <ThemedText style={styles.buttonText}>
                            Créer une nouvelle liste
                          </ThemedText>
                        </View>
                      </ThemedButton>
                    </Pressable>
                  </Link>
                </View>
              </View>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 15,
  },
  header: {
    paddingVertical: 15,
    alignItems: 'center',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    marginTop: 5,
    fontSize: 16,
    opacity: 0.7,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    width: "100%",
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    marginBottom: 20,
    color: colors.primary,
  },
  image: {
    width: 220,
    height: 220,
    marginVertical: 20,
  },
  inputContainer: {
    width: "100%",
    marginTop: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundVariant,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.grayLight,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  listeNameInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: colors.white,
  },
  button: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
