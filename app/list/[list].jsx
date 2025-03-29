import Card from "@/components/Card";
import { ProductCard } from "@/components/Product";
import RadioButton from "@/components/RadioButton";
import { ThemedButton } from "@/components/ThemedButton";
import ThemedText from "@/components/ThemedText";
import { createProduct, deleteProduct, getProducts, createList, getListById } from "@/db/query"; // Ajout de createList
import useColor from "@/hook/useColor";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    const computListPrice = () => {
        return Object.values(productsPriceList).reduce((acc, val) => parseFloat(acc) + parseFloat(val), 0);
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
                    const newListId = await createList(params.listName);
                    setList(getListById(newListId));
                } catch (error) {
                    console.error("Erreur lors de la création de la liste :", error);
                }
            }
            else if(params.listId) {
                setList(await getListById(params.listId))
            }
        };

        initList();

    }, [params.listName, params.listId]);

    // Récupérer les produits de la liste
    useEffect(() => {
        const fetchProducts = async () => {
            if (list.id) {
                try {
                    const products = await getProducts(list.id);
                    console.log("les produits: ", products);
                    setProductData(products);
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
                await createProduct({ ...formData, listId: list.id }); // Ajoute l'ID de la liste au produit
                setFormData(initFormValue);
                setVisibility(false);
                setRefreshList(!refreshList);
            } catch (error) {
                console.error("Problème de création :", error);
            }
        }
    };

    const handleWeighableOptionSelect = (option) => {
        setFormData((prevFormData) => ({ ...prevFormData, isWeighable: option }));
    };

    const removeProduct = async (id) => {
        try {
            await deleteProduct(id);
            // dlete removed product price on list
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

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerStyle}>
                <ThemedText variant="heading1">
                    {list?.name}
                </ThemedText>
                <ThemedText variant="heading2" color="primary">
                    Total des courses: {listPrice} €
                </ThemedText>
                <Pressable onPress={() => setVisibility(true)} style={{ width: "100%" }}>
                    <ThemedButton style={{ marginVertical: 10, width: "100%" }}>
                        Ajouter un produit
                    </ThemedButton>
                </Pressable>
                <Modal
                    visible={visibility}
                    animationType="fade"
                    onRequestClose={() => setVisibility(false)}
                    transparent={true}
                >
                    <View style={styles.modal}>
                        <View style={styles.modalFormContainer}>
                            <TextInput
                                placeholderTextColor={colors.grayLight}
                                style={styles.inputStyle}
                                placeholder="Nom du produit"
                                value={formData.name}
                                onChangeText={(text) => setFormData((prevFormData) => ({ ...prevFormData, name: text }))}
                            />
                            <TextInput
                                placeholderTextColor={colors.grayLight}
                                style={styles.inputStyle}
                                placeholder="Quantité"
                                keyboardType="numeric"
                                value={formData.quantity}
                                onChangeText={(value) => setFormData({ ...formData, quantity: value })}
                            />
                            <View style={styles.isWeighableStyle}>
                                <ThemedText>Ce produit est à peser ?</ThemedText>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 40 }}>
                                    <TouchableOpacity style={styles.touchableOptionStyle} onPress={() => handleWeighableOptionSelect(true)}>
                                        <ThemedText>Oui</ThemedText>
                                        <RadioButton isSelected={formData.isWeighable} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.touchableOptionStyle} onPress={() => handleWeighableOptionSelect(false)}>
                                        <ThemedText>Non</ThemedText>
                                        <RadioButton isSelected={!formData.isWeighable} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ flexDirection: "row", paddingRight: 7, paddingTop: 7, gap: 30, width: "100%", justifyContent: "flex-end" }}>
                                <Pressable onPress={() => setVisibility(false)}>
                                    <ThemedText color="primary">Annuler</ThemedText>
                                </Pressable>
                                <Pressable onPress={() => handleSubmit()}>
                                    <ThemedText color="primary">Ajouter</ThemedText>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
            <Card style={{ flex: 1, padding: 15, backgroundColor: colors.background, gap: 25, flexDirection: "colum" }}>
                <FlatList
                    data={productData}
                    renderItem={({ item }) => (
                        <ProductCard
                            id={item.id}
                            name={item.name}
                            quantity={item.quantity}
                            isWeighable={item.isWeighable}
                            removeProduct={removeProduct}
                            totalListPrice={productsPriceList}
                            setProductsPriceList={setProductsPriceList}
                        />
                    )}
                    keyExtractor={(product) => product.name}
                    contentContainerStyle={{ gap: 10 }}
                />
            </Card>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.black,
    },
    headerStyle: {
        width: "100%",
        flexDirection: 'column',
        alignItems: "center",
        paddingTop: 70,
        paddingHorizontal: 5,
    },
    modal: {
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    modalFormContainer: {
        backgroundColor: colors.black,
        paddingHorizontal: 15,
        paddingVertical: 35,
        width: "95%",
        gap: 25,
        borderColor: colors.primary,
        borderWidth: 1,
        borderRadius: 8
    },
    inputStyle: {
        backgroundColor: colors.background,
        paddingVertical: 5,
        paddingHorizontal: 0,
        borderBottomColor: colors.primary,
        borderBottomWidth: 2,
        color: colors.white,
        width: "100%"
    },
    isWeighableStyle: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    touchableOptionStyle: {
        flexDirection: "row",
        alignItems: "center",
        gap: 7
    }
});


