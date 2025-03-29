import { MainView, MainViewCard } from "@/components/MainView";
import { ThemedButton } from "@/components/ThemedButton";
import ThemedText from "@/components/ThemedText";
import { resetDatabase } from "@/db/database";
import useColor from "@/hook/useColor";
import { Link } from "expo-router";
import { useState } from "react";
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
} from "react-native";

const colors = useColor();

export default function Index() {
  const [listName, setListName] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText color="primary" variant="heading1">
              Courseo
            </ThemedText>
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            <ThemedText variant="heading2" style={styles.title}>
              Nouvelle Liste
            </ThemedText>

            <Image
              source={require("@/assets/images/courseo-home-ill.png")}
              style={styles.image}
            />

            <View style={styles.inputContainer}>
              <TextInput
                placeholderTextColor={colors.grayLight}
                placeholder="Nom de la liste"
                value={listName}
                onChangeText={setListName}
                style={styles.listeNameInput}
              />

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
                    Créer une nouvelle liste
                  </ThemedButton>
                </Pressable>
              </Link>
              <Pressable onPress={() => resetDatabase()}>
                  <ThemedButton
                    style={[
                      styles.button, {marginVertical: 8}
                    ]}
                  >
                    reset database
                  </ThemedButton>
                </Pressable>
            </View>
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
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  header: {
    paddingVertical: 15,
  },
  title: {
    textAlign: "center",
    fontSize: 28,
    marginVertical: 10,
    color: colors.primary,
  },
  image: {
    width: 250,
    height: 250,
    marginVertical: 20,
  },
  mainContent: {
    alignItems: "center",
    width: "100%",
  },
  inputContainer: {
    width: "100%",
    marginTop: 20,
  },
  listeNameInput: {
    borderRadius: 25,
    padding: 15,
    fontSize: 16,
    color: colors.white,
    backgroundColor: colors.backgroundVariant,
    borderWidth: 1,
    borderColor: colors.grayLight,
    marginBottom: 15,
  },
  button: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
});
