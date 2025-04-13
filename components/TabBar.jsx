import useColor from "@/hook/useColor";
import { Pressable, StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import ThemedText from "./ThemedText";
import { router, usePathname } from "expo-router";

const colors = useColor();
export default function TabBar() {
    const pathname = usePathname();
    
    const isHomeActive = pathname === "/";
    const isArchiveActive = pathname === "/archive";
    const isAboutActive = pathname === "/about";
    
    return (
        <View style={styles.container}>
            <Pressable 
                onPress={() => {router.replace("/")}} 
                style={[styles.tab, isHomeActive && styles.activeTab]}
            >
                <Icon 
                    name={isHomeActive ? "home" : "home-outline"} 
                    size={24} 
                    color={isHomeActive ? colors.white : colors.grayLight} 
                />
                <ThemedText 
                    style={[styles.tabText, isHomeActive && styles.activeTabText]}
                >
                    Accueil
                </ThemedText>
            </Pressable>
            
            <View style={styles.divider} />
            
            <Pressable 
                onPress={() => router.push("/archive")} 
                style={[styles.tab, isArchiveActive && styles.activeTab]}
            >
                <Entypo 
                    name="archive" 
                    size={24} 
                    color={isArchiveActive ? colors.white : colors.grayLight} 
                />
                <ThemedText 
                    style={[styles.tabText, isArchiveActive && styles.activeTabText]}
                >
                    Archives
                </ThemedText>
            </Pressable>

            <View style={styles.divider} />

            <Pressable 
                onPress={() => router.push("/about")} 
                style={[styles.tab, isAboutActive && styles.activeTab]}
            >
                <Icon 
                    name={isAboutActive ? "information-circle" : "information-circle-outline"} 
                    size={24} 
                    color={isAboutActive ? colors.white : colors.grayLight} 
                />
                <ThemedText 
                    style={[styles.tabText, isAboutActive && styles.activeTabText]}
                >
                    À propos
                </ThemedText>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        backgroundColor: colors.backgroundVariant,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        paddingTop: 8,
        paddingBottom: 8,
        paddingHorizontal: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    },
    tab: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 8,
        gap: 6,
    },
    activeTab: {
        backgroundColor: colors.primary + "40", // Ajout d'une transparence plus légère
        borderRadius: 12,
    },
    tabText: {
        fontSize: 14,
        color: colors.grayLight,
    },
    activeTabText: {
        color: colors.primary,
        fontWeight: "600",
    },
    divider: {
        width: 1,
        backgroundColor: colors.background,
        marginHorizontal: 5,
    }
});