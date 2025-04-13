import ThemedText from "@/components/ThemedText";
import { getLists } from "@/db/query";
import useColor from "@/hook/useColor";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, Pressable, FlatList, Image, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Card from "@/components/Card";
import { ThemedButton } from "@/components/ThemedButton";
import { resetDatabase } from "@/db/database";

const colors = useColor();
export default function Archive() {
    const [listsData, setListsData] = useState([]);
    const [showResetOptions, setShowResetOptions] = useState(false);
    
    useEffect(() => {
      async function getData() {
        const lists = await getLists();
        // Trier les listes par date (les plus récentes en premier)
        const sortedLists = lists.sort((a, b) => new Date(b.date) - new Date(a.date));
        setListsData(sortedLists);
      }
      getData();
    }, [])
    
    // Formater la date pour l'affichage
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    const handleResetDatabase = () => {
        Alert.alert(
            "Réinitialiser la base de données",
            "Êtes-vous sûr de vouloir réinitialiser toutes les données ? Cette action est irréversible.",
            [
                {
                    text: "Annuler",
                    style: "cancel"
                },
                {
                    text: "Réinitialiser",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await resetDatabase();
                            setListsData([]);
                            Alert.alert("Succès", "La base de données a été réinitialisée avec succès.");
                        } catch (error) {
                            Alert.alert("Erreur", "Une erreur est survenue lors de la réinitialisation.");
                        }
                    }
                }
            ]
        );
    }
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <ThemedText variant="heading1" style={styles.title}>
                    Historique Des Courses
                </ThemedText>
                <ThemedText style={styles.subtitle}>
                    {listsData.length} liste{listsData.length > 1 ? 's' : ''} archivée{listsData.length > 1 ? 's' : ''}
                </ThemedText>
                
                <Pressable 
                    style={styles.settingsButton}
                    onPress={() => setShowResetOptions(!showResetOptions)}
                >
                    <Ionicons name="settings-outline" size={24} color={colors.grayLight} />
                </Pressable>
            </View>
            
            {showResetOptions && (
                <Card style={styles.resetCard}>
                    <View style={styles.resetCardHeader}>
                        <ThemedText variant="heading2">Paramètres</ThemedText>
                        <Pressable onPress={() => setShowResetOptions(false)}>
                            <Ionicons name="close-circle" size={24} color={colors.grayLight} />
                        </Pressable>
                    </View>
                    <ThemedText style={styles.resetDescription}>
                        La réinitialisation de la base de données supprimera toutes vos listes et produits.
                    </ThemedText>
                    <ThemedButton 
                        style={styles.resetButton}
                        onPress={handleResetDatabase}
                    >
                        <View style={styles.resetButtonContent}>
                            <Ionicons name="trash-outline" size={20} color="white" />
                            <ThemedText style={styles.resetButtonText}>
                                Réinitialiser la base de données
                            </ThemedText>
                        </View>
                    </ThemedButton>
                </Card>
            )}
            
            {listsData.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="archive-outline" size={80} color={colors.grayLight} />
                    <ThemedText style={styles.emptyText}>
                        Aucune liste archivée
                    </ThemedText>
                    <ThemedText style={styles.emptySubtext}>
                        Vos listes de courses apparaîtront ici
                    </ThemedText>
                </View>
            ) : (
                <FlatList
                    data={listsData}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({item}) => (
                        <Pressable 
                            onPress={() => router.push({pathname: "/list/[list]", params:{listId: item.id}})} 
                            style={styles.itemContainer}
                        >
                            <Card style={styles.itemCard}>
                                <View style={styles.itemContent}>
                                    <View style={styles.itemHeader}>
                                        <ThemedText variant="heading2" style={styles.itemName}>
                                            {item.name}
                                        </ThemedText>
                                        <View style={styles.dateContainer}>
                                            <Ionicons name="calendar-outline" size={16} color={colors.grayLight} style={styles.dateIcon} />
                                            <ThemedText style={styles.dateText}>
                                                {formatDate(item.date)}
                                            </ThemedText>
                                        </View>
                                    </View>
                                    <View style={styles.itemFooter}>
                                        <View style={styles.arrowContainer}>
                                            <ThemedText style={styles.viewText}>Voir la liste</ThemedText>
                                            <Ionicons name="chevron-forward" size={20} color={colors.primary} />
                                        </View>
                                    </View>
                                </View>
                            </Card>
                        </Pressable>
                    )}
                    keyExtractor={(list) => list.id}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        padding: 20,
        paddingBottom: 10,
        position: 'relative',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    subtitle: {
        marginTop: 5,
        opacity: 0.7,
        fontSize: 16,
    },
    settingsButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        padding: 5,
    },
    resetCard: {
        margin: 15,
        marginTop: 0,
        borderRadius: 12,
    },
    resetCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    resetDescription: {
        marginBottom: 15,
        opacity: 0.7,
    },
    resetButton: {
        backgroundColor: colors.error,
    },
    resetButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    resetButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    listContainer: {
        padding: 15,
    },
    itemContainer: {
        marginBottom: 15,
    },
    itemCard: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    itemContent: {
        padding: 15,
    },
    itemHeader: {
        marginBottom: 10,
    },
    itemName: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 5,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateIcon: {
        marginRight: 5,
    },
    dateText: {
        fontSize: 14,
        opacity: 0.7,
    },
    itemFooter: {
        marginTop: 5,
    },
    arrowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    viewText: {
        fontSize: 14,
        color: colors.primary,
        marginRight: 5,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 15,
        marginBottom: 5,
    },
    emptySubtext: {
        fontSize: 14,
        opacity: 0.7,
        textAlign: 'center',
    }
});