import { StyleSheet, View, ScrollView, Linking, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import useColor from "@/hook/useColor";
import ThemedText from "@/components/ThemedText";
import Card from "@/components/Card";

const colors = useColor();

// Données de l'application
const appData = {
  "appName": "Courseo",
  "version": "1.0.0",
  "description": "Courseo est votre compagnon idéal pour faire vos courses sans prise de tête. Avec une interface simple et rapide à prendre en main, l'application vous aide à organiser efficacement votre liste d'achats, et calcule en temps réel le total de vos dépenses au fur et à mesure que vous ajoutez des articles. Fini les mauvaises surprises en caisse : suivez votre budget, contrôlez vos dépenses, et faites vos courses en toute tranquillité !",
  "developer": "Teko Fabrice",
  "contactEmail": "tekofabricefolly@gamil.com",
  "website": "https://teko-fabrice.vercel.app/",
  "privacyPolicy": "Courseo ne collecte, n'utilise, ni ne partage aucune donnée personnelle. Toutes les informations restent sur votre appareil. Aucune donnée n'est stockée ou transmise à des tiers. Pour toute question, veuillez contacter le développeur à tekofabricefolly@gamil.com.",
  "credits": "Développée par Teko Fabrice"
};

export default function About() {
  const handleEmailPress = () => {
    Linking.openURL(`mailto:${appData.contactEmail}`);
  };

  const handleWebsitePress = () => {
    Linking.openURL(appData.website);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </Pressable>
        <ThemedText variant="heading1" style={styles.headerTitle}>
          À propos
        </ThemedText>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Image 
            source={require("@/assets/images/icon.png")} 
            style={styles.logo} 
          />
        </View>

        <Card style={styles.appInfoCard}>
          <View style={styles.appInfoContent}>
            <ThemedText variant="heading2" style={styles.appName}>
              {appData.appName}
            </ThemedText>
            <View style={styles.versionContainer}>
              <ThemedText style={styles.versionText}>
                Version {appData.version}
              </ThemedText>
            </View>
            <ThemedText style={styles.description}>
              {appData.description}
            </ThemedText>
          </View>
        </Card>

        <Card style={styles.contactCard}>
          <View style={styles.contactContent}>
            <ThemedText variant="heading2" style={styles.contactTitle}>
              Contact
            </ThemedText>
            <View style={styles.contactItem}>
              <Ionicons name="person-outline" size={20} color={colors.primary} style={styles.contactIcon} />
              <ThemedText style={styles.contactText}>
                {appData.developer}
              </ThemedText>
            </View>
            <Pressable onPress={handleEmailPress} style={styles.contactItem}>
              <Ionicons name="mail-outline" size={20} color={colors.primary} style={styles.contactIcon} />
              <ThemedText style={styles.contactText}>
                {appData.contactEmail}
              </ThemedText>
            </Pressable>
            <Pressable onPress={handleWebsitePress} style={styles.contactItem}>
              <Ionicons name="globe-outline" size={20} color={colors.primary} style={styles.contactIcon} />
              <ThemedText style={styles.contactText}>
                {appData.website}
              </ThemedText>
            </Pressable>
          </View>
        </Card>

        <Card style={styles.privacyCard}>
          <View style={styles.privacyContent}>
            <ThemedText variant="heading2" style={styles.privacyTitle}>
              Politique de confidentialité
            </ThemedText>
            <ThemedText style={styles.privacyText}>
              {appData.privacyPolicy}
            </ThemedText>
          </View>
        </Card>

        <View style={styles.creditsContainer}>
          <ThemedText style={styles.creditsText}>
            {appData.credits}
          </ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundVariant,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 34, // Même largeur que le bouton retour pour centrer le titre
  },
  scrollContent: {
    flexGrow: 1,
    padding: 15,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  appInfoCard: {
    marginBottom: 15,
    borderRadius: 12,
  },
  appInfoContent: {
    padding: 15,
    alignItems: 'center',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  versionContainer: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 15,
    marginBottom: 15,
  },
  versionText: {
    fontSize: 14,
    color: colors.primary,
  },
  description: {
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.8,
  },
  contactCard: {
    marginBottom: 15,
    borderRadius: 12,
  },
  contactContent: {
    padding: 15,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactIcon: {
    marginRight: 10,
  },
  contactText: {
    fontSize: 16,
  },
  privacyCard: {
    marginBottom: 15,
    borderRadius: 12,
  },
  privacyContent: {
    padding: 15,
  },
  privacyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  privacyText: {
    lineHeight: 22,
    opacity: 0.8,
  },
  creditsContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  creditsText: {
    fontSize: 14,
    opacity: 0.7,
  },
}); 