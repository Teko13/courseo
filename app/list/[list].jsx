import Card from "@/components/Card";
import { ProductCard } from "@/components/Product";
import RadioButton from "@/components/RadioButton";
import { ThemedButton } from "@/components/ThemedButton";
import ThemedText from "@/components/ThemedText";
import { createProduct, deleteProduct, getProducts, createList, getListById, updateProduct, deleteList } from "@/db";
import useColor from "@/hook/useColor";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView, Vibration } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const colors = useColor();

export default function List() {
    const initFormValue = {
        id: "",
        name: "",
        quantity: "1",
        isWeighable: false
    };
    const [formData, setFormData] = useState(initFormValue);
    const [visibility, setVisibility] = useState(false);
    const [productData, setProductData] = useState([]);
    const [refreshList, setRefreshList] = useState(true);
    const [list, setList] = useState(null);
    const [productsPriceList, setProductsPriceList] = useState({});
    const [listPrice, setListPrice] = useState(0);
    const [checkedProductsCount, setCheckedProductsCount] = useState(0);
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    
    const computListPrice = () => {
        return Object.values(productsPriceList).reduce((acc, val) => parseFloat(acc) + parseFloat(val), 0);
    }
    
    const updateOneProduct = async (id, productObject) => {
        try {
           await updateProduct(id, productObject);
           setRefreshList(!refreshList);
        } catch (error) {
            console.error("une erreur est survenue lors de la mise a jour produit", error)
        }
    }
    
    const handleProductChecked = (isChecked) => {
        if (isChecked) {
            setCheckedProductsCount(prev => prev + 1);
        } else {
            setCheckedProductsCount(prev => prev - 1);
        }
    }
    
    const isLastProductToCheck = () => {
        const totalProducts = productData.length;
        const currentCheckedCount = checkedProductsCount;
        return currentCheckedCount === totalProducts - 1;
    }

    const params = useLocalSearchParams();
    useEffect(() => {
      setListPrice(computListPrice());
    }, [productsPriceList])
    
    // Créer une nouvelle liste dès l'arrivée sur la page
    useEffect(() => {
        const initList = async () => {
            if(params.listName) {
                try {
                    // Créer la liste et récupérer son ID
                    const newListId = await createList(params.listName);
                    
                    if (!newListId) {
                        console.error("Erreur: ID de liste non défini après création");
                        Alert.alert("Erreur", "Impossible de créer la liste. Veuillez réessayer.");
                        return;
                    }
                    
                    // Créer un objet liste temporaire avec l'ID récupéré
                    const tempList = {
                        id: newListId,
                        name: params.listName,
                        date: new Date().toISOString()
                    };
                    
                    // Mettre à jour l'état avec cette liste temporaire
                    setList(tempList);
                    
                    // Récupérer les détails complets de la liste
                    const fullList = await getListById(newListId);
                    if (fullList) {
                        setList(fullList);
                    } else {
                        console.error("La liste n'a pas été trouvée après création");
                    }
                } catch (error) {
                    console.error("Erreur lors de la création de la liste :", error);
                    Alert.alert("Erreur", "Impossible de créer la liste. Veuillez réessayer.");
                }
            }
            else if(params.listId) {
                try {
                    const existingList = await getListById(params.listId);
                    if (existingList) {
                        setList(existingList);
                    } else {
                        console.error("La liste n'a pas été trouvée");
                        Alert.alert("Erreur", "Impossible de trouver la liste. Veuillez réessayer.");
                    }
                } catch (error) {
                    console.error("Erreur lors de la récupération de la liste :", error);
                    Alert.alert("Erreur", "Impossible de récupérer la liste. Veuillez réessayer.");
                }
            }
        };

        initList();
    }, [params.listName, params.listId]);

    // Récupérer les produits de la liste
    useEffect(() => {
        const fetchProducts = async () => {
            if (list?.id) {
                try {
                    const products = await getProducts(list.id);
                    // Inverser le tableau pour que les produits ajoutés en dernier s'affichent en premier
                    setProductData([...products].reverse());
                    
                    // Compter les produits déjà cochés
                    const checkedCount = products.filter(product => product.isAdd).length;
                    setCheckedProductsCount(checkedCount);
                } catch (error) {
                    console.error("Problème de récupération des produits :", error);
                }
            }
        };

       fetchProducts();
    }, [refreshList, list]);
    
    const handleSubmit = async () => {
        if (formData.quantity <= 0) {
            Alert.alert("Attention", "Ajoutez une quantité à votre produit");
        } else if (formData.name === "") {
            Alert.alert("Attention", "Précisez le nom de votre produit");
        } else {
            try {
                await createProduct({ ...formData, listId: list.id });
                setFormData(initFormValue);
                setIsAddingProduct(false);
                setRefreshList(!refreshList);
            } catch (error) {
                console.error("Problème de création du produit :", error);
            }
        }
    };

    const handleWeighableOptionSelect = (option) => {
        setFormData((prevFormData) => ({ ...prevFormData, isWeighable: option }));
    };

    const removeProduct = async (id) => {
        try {
            await deleteProduct(id);
            // Supprimer le prix du produit de la liste
            setProductsPriceList(prev => {
                const copie = {...prev};
                delete copie[id];
                return copie
            })
            setRefreshList(!refreshList);
        } catch (error) {
            console.error(error);
        }
    };

    // Formater la date pour l'affichage
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Fonction pour supprimer la liste
    const handleDeleteList = () => {
        Alert.alert(
            "Supprimer la liste",
            "Êtes-vous sûr de vouloir supprimer cette liste ? Cette action est irréversible.",
            [
                {
                    text: "Annuler",
                    style: "cancel"
                },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteList(list.id);
                            router.replace("/archive");
                        } catch (error) {
                            console.error("Erreur lors de la suppression de la liste :", error);
                            Alert.alert("Erreur", "Impossible de supprimer la liste. Veuillez réessayer.");
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
            >
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.white} />
                    </Pressable>
                    <ThemedText variant="heading1" style={styles.headerTitle}>
                        {list?.name || "Chargement..."}
                    </ThemedText>
                    <Pressable onPress={handleDeleteList} style={styles.deleteButton}>
                        <Ionicons name="trash-outline" size={24} color={colors.error} />
                    </Pressable>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Card style={styles.summaryCard}>
                        <View style={styles.summaryContent}>
                            <View style={styles.summaryItem}>
                                <Ionicons name="cart-outline" size={24} color={colors.primary} />
                                <ThemedText style={styles.summaryLabel}>Produits</ThemedText>
                                <ThemedText variant="heading2" style={styles.summaryValue}>
                                    {productData.length}
                                </ThemedText>
                            </View>
                            <View style={styles.summaryDivider} />
                            <View style={styles.summaryItem}>
                                <Ionicons name="checkmark-circle-outline" size={24} color={colors.success} />
                                <ThemedText style={styles.summaryLabel}>Ajoutés</ThemedText>
                                <ThemedText variant="heading2" style={styles.summaryValue}>
                                    {checkedProductsCount}
                                </ThemedText>
                            </View>
                            <View style={styles.summaryDivider} />
                            <View style={styles.summaryItem}>
                                <Ionicons name="wallet-outline" size={24} color={colors.primary} />
                                <ThemedText style={styles.summaryLabel}>Total</ThemedText>
                                <ThemedText variant="heading2" style={styles.summaryValue}>
                                    {listPrice.toFixed(2)} €
                                </ThemedText>
                            </View>
                        </View>
                    </Card>

                    <View style={styles.addProductSection}>
                        {isAddingProduct ? (
                            <Card style={styles.addProductCard}>
                                <View style={styles.addProductHeader}>
                                    <ThemedText variant="heading2">Ajouter un produit</ThemedText>
                                    <Pressable onPress={() => setIsAddingProduct(false)}>
                                        <Ionicons name="close-circle" size={24} color={colors.grayLight} />
                                    </Pressable>
                                </View>
                                <View style={styles.inputsContainer}>
                                    <TextInput
                                        placeholderTextColor={colors.grayLight}
                                        style={styles.nameInput}
                                        placeholder="Nom du produit"
                                        value={formData.name}
                                        onChangeText={(text) => setFormData((prevFormData) => ({ ...prevFormData, name: text }))}
                                    />
                                    <View style={styles.quantityContainer}>
                                        <TextInput
                                            placeholderTextColor={colors.grayLight}
                                            style={styles.quantityInput}
                                            placeholder="Qté"
                                            keyboardType="numeric"
                                            value={formData.quantity}
                                            onChangeText={(value) => setFormData({ ...formData, quantity: value })}
                                        />
                                    </View>
                                </View>
                                <View style={styles.weighableContainer}>
                                    <ThemedText>Ce produit est à peser ?</ThemedText>
                                    <View style={styles.weighableOptions}>
                                        <TouchableOpacity 
                                            style={[styles.weighableOption, formData.isWeighable && styles.weighableOptionSelected]} 
                                            onPress={() => handleWeighableOptionSelect(true)}
                                        >
                                            <ThemedText>Oui</ThemedText>
                                            <RadioButton isSelected={formData.isWeighable} />
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={[styles.weighableOption, !formData.isWeighable && styles.weighableOptionSelected]} 
                                            onPress={() => handleWeighableOptionSelect(false)}
                                        >
                                            <ThemedText>Non</ThemedText>
                                            <RadioButton isSelected={!formData.isWeighable} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <ThemedButton 
                                    style={styles.addButton}
                                    onPress={handleSubmit}
                                >
                                    Ajouter
                                </ThemedButton>
                            </Card>
                        ) : (
                            <Pressable 
                                style={styles.addProductButton}
                                onPress={() => setIsAddingProduct(true)}
                            >
                                <Ionicons name="add-circle" size={24} color={colors.white} />
                                <ThemedText style={styles.addProductText}>Ajouter un produit</ThemedText>
                            </Pressable>
                        )}
                    </View>

                    <View style={styles.listContainer}>
                        <Card style={[
                            styles.productListCard, 
                            checkedProductsCount === productData.length && productData.length > 0 && styles.completedCard
                        ]}>
                            {checkedProductsCount === productData.length && productData.length > 0 && (
                                <View style={styles.completedLabelContainer}>
                                    <ThemedText 
                                        style={styles.completedText}
                                        color="success"
                                    >
                                        Terminé
                                    </ThemedText>
                                </View>
                            )}
                            {productData.length === 0 ? (
                                <View style={styles.emptyContainer}>
                                    <Ionicons name="cart-outline" size={60} color={colors.grayLight} />
                                    <ThemedText style={styles.emptyText}>
                                        Aucun produit dans cette liste
                                    </ThemedText>
                                    <ThemedText style={styles.emptySubtext}>
                                        Ajoutez des produits pour commencer
                                    </ThemedText>
                                </View>
                            ) : (
                                productData.map((item) => (
                                    <ProductCard
                                        key={item.id}
                                        id={item.id}
                                        price={item.price}
                                        name={item.name}
                                        quantity={item.quantity}
                                        isWeighable={item.isWeighable}
                                        removeProduct={removeProduct}
                                        totalListPrice={productsPriceList}
                                        listId={list.id}
                                        setProductsPriceList={setProductsPriceList}
                                        isAdd={item.isAdd}
                                        updateProduct={updateOneProduct}
                                        onProductChecked={handleProductChecked}
                                        isLastProductToCheck={isLastProductToCheck}
                                    />
                                ))
                            )}
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
    deleteButton: {
        padding: 5,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 15,
    },
    summaryCard: {
        marginBottom: 15,
        borderRadius: 12,
    },
    summaryContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
    },
    summaryItem: {
        alignItems: 'center',
        flex: 1,
    },
    summaryLabel: {
        fontSize: 14,
        opacity: 0.7,
        marginVertical: 5,
    },
    summaryValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    summaryDivider: {
        width: 1,
        backgroundColor: colors.backgroundVariant,
        marginHorizontal: 10,
    },
    addProductSection: {
        marginBottom: 15,
    },
    addProductButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        padding: 15,
        borderRadius: 12,
        gap: 10,
    },
    addProductText: {
        fontSize: 16,
        fontWeight: '600',
    },
    addProductCard: {
        borderRadius: 12,
        padding: 15,
    },
    addProductHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    inputsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        gap: 10,
    },
    nameInput: {
        flex: 1,
        backgroundColor: colors.backgroundVariant,
        borderRadius: 8,
        padding: 12,
        color: colors.white,
        fontSize: 16,
    },
    quantityContainer: {
        width: 70,
    },
    quantityInput: {
        backgroundColor: colors.backgroundVariant,
        borderRadius: 8,
        padding: 12,
        color: colors.white,
        fontSize: 16,
        textAlign: 'center',
    },
    weighableContainer: {
        marginBottom: 15,
    },
    weighableOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    weighableOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 10,
        borderRadius: 8,
        backgroundColor: colors.backgroundVariant,
        flex: 1,
        marginHorizontal: 5,
    },
    weighableOptionSelected: {
        backgroundColor: colors.primary + '40', // Ajout d'une transparence
    },
    addButton: {
        width: '100%',
    },
    listContainer: {
        flex: 1,
        position: 'relative',
    },
    completedLabelContainer: {
        position: 'absolute',
        top: -12,
        left: 15,
        backgroundColor: colors.background,
        paddingHorizontal: 8,
        zIndex: 1,
    },
    completedText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    productListCard: {
        flex: 1,
        padding: 15,
        backgroundColor: colors.background,
        gap: 15,
        flexDirection: "column",
        borderRadius: 12,
    },
    completedCard: {
        borderWidth: 1,
        borderColor: '#4CAF50',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
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


