import { useEffect, useState } from "react";
import Card from "./Card";
import useColor from "@/hook/useColor";
import { Image, Pressable, StyleSheet, TextInput, View, Vibration, Animated } from "react-native";
import ThemedText from "./ThemedText";
const colors = useColor();
import { Ionicons } from "@expo/vector-icons";

export function ProductCard({ id, name, quantity, price, isWeighable, removeProduct, listId, productsPriceList, setProductsPriceList, isAdd, updateProduct, onProductChecked, isLastProductToCheck}) {
    const [nameState, setName] = useState(name);
    const [isAddState, setIsAdd] = useState(isAdd);
    const [quantityState, setQuantity] = useState(quantity);
    const [priceState, setPrice] = useState(price !== null && price !== undefined ? price.toString() : "");
    const [isWeighableState, setIsWeighable] = useState(isWeighable);
    const [scaleAnim] = useState(new Animated.Value(1));

    useEffect(() => {
        setIsAdd(isAdd);
    }, [isAdd]);

    const computTotal = (price = priceState) => {
        if(!isWeighableState) {
            return (reformatePrice(price) * quantityState).toFixed(2);
        }
        return reformatePrice(price).toFixed(2);
    }
    
    const reformatePrice = (text) => {
        if (text === null || text === undefined || text === "") {
            return 0;
        }
        return parseFloat(text.toString().replace(/,/g, '.')) || 0;
    }
    
    const handleAddItem = async (itemAddState) => {
        // Animation de scale lors du clic
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            })
        ]).start();
        
        setIsAdd(itemAddState);
        await updateProduct(id, {name: nameState, quantity: quantityState, listId: listId, price: priceState, isWeighable: isWeighableState, isAdd: itemAddState});
        
        // Notifier le composant parent que ce produit a été coché
        onProductChecked(itemAddState);
        
        // Vérifier si c'est le dernier produit à être coché
        if (itemAddState && isLastProductToCheck()) {
            Vibration.vibrate(500); // Vibration de 500ms
        }
    }
    
    const updateProductsPriceList = (productTotalPrice) => {
        setProductsPriceList((prevList) => {
            return {...prevList, [id]: productTotalPrice}
        });
    }
    
    useEffect(() => {
      updateProductsPriceList(computTotal());
    }, [])
    
    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Card style={[styles.cardStyle, isAddState && styles.cardChecked]}>
                <View style={styles.cardContent}>
                    <View style={styles.mainRow}>
                        <View style={styles.leftSection}>
                            <Pressable
                                style={[styles.checkBox, isAddState && styles.checkBoxActive]}
                                onPress={() => handleAddItem(!isAddState)}
                            >
                                {isAddState ? (
                                    <Ionicons name="checkmark" size={18} color="white" />
                                ) : null}
                            </Pressable>
                            
                            <View style={styles.productInfo}>
                                <View style={styles.quantityBadge}>
                                    <ThemedText style={styles.quantityText}>
                                        {quantityState}
                                    </ThemedText>
                                </View>
                                <ThemedText style={[styles.productName, isAddState && styles.productNameChecked]}>
                                    {nameState}
                                </ThemedText>
                            </View>
                        </View>
                        
                        <View style={styles.rightSection}>
                            <View style={styles.priceContainer}>
                                <TextInput 
                                    value={((priceState == 0 || priceState === null) && "") || priceState.toString()} 
                                    keyboardType="decimal-pad" 
                                    style={[styles.priceInput, isAddState && styles.disabledInput]} 
                                    onChangeText={(text) => {
                                        setPrice(text);
                                        if(typeof reformatePrice(text) === "number" && !isNaN(reformatePrice(text))) {
                                            updateProductsPriceList(computTotal(text));
                                        }
                                    }}
                                    placeholder="Prix"
                                    placeholderTextColor={colors.grayLight}
                                    editable={!isAddState}
                                />
                                <ThemedText style={styles.unitPrice}>
                                    €
                                </ThemedText>
                            </View>
                            
                            <Pressable 
                                onPress={() => removeProduct(id)} 
                                style={styles.removeButton}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Ionicons name="close-circle" size={22} color={colors.grayLight} />
                            </Pressable>
                        </View>
                    </View>
                    
                    <View style={styles.totalRow}>
                        <ThemedText style={styles.totalLabel}>
                            Total
                        </ThemedText>
                        <ThemedText color="primary" style={styles.totalPrice}>
                            {computTotal()} €
                        </ThemedText>
                    </View>
                </View>
            </Card>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    cardStyle: {
        marginVertical: 8,
        width: "100%",
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    cardContent: {
        padding: 12,
    },
    mainRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    leftSection: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    rightSection: {
        flexDirection: "row",
        alignItems: "center",
    },
    productInfo: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 10,
        flex: 1,
    },
    quantityBadge: {
        backgroundColor: colors.primary + '20',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 10,
    },
    checkBox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.grayLight,
        justifyContent: "center",
        alignItems: "center",
    },
    checkBoxActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    productName: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.white,
        flex: 1,
    },
    productNameChecked: {
        textDecorationLine: "line-through",
        opacity: 0.7,
    },
    quantityText: {
        fontSize: 14,
        fontWeight: "700",
        color: colors.primary,
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.primary + '15',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginRight: 10,
        borderWidth: 1,
        borderColor: colors.primary + '40',
    },
    priceInput: {
        color: colors.white,
        fontSize: 16,
        fontWeight: "600",
        width: 50,
        textAlign: "right",
    },
    unitPrice: {
        fontSize: 14,
        color: colors.primary,
        marginLeft: 2,
        fontWeight: "600",
    },
    removeButton: {
        padding: 4,
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: colors.background + '30',
    },
    totalLabel: {
        fontSize: 14,
        color: colors.grayLight,
    },
    totalPrice: {
        fontSize: 16,
        fontWeight: "700",
    },
    cardChecked: {
        backgroundColor: colors.backgroundVariant + '80',
    },
    disabledInput: {
        opacity: 0.5,
    },
});