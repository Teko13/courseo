import { useState } from "react";
import Card from "./Card";
import useColor from "@/hook/useColor";
import { Image, Pressable, StyleSheet, TextInput, View } from "react-native";
import ThemedText from "./ThemedText";
const colors = useColor();
import Entypo from "react-native-vector-icons/Entypo"

export function ProductCard({ id, name, quantity, price, isWeighable, removeProduct, productsPriceList, setProductsPriceList}) {
    const [nameState, setName] = useState(name);
    const [isAddState, setIsAdd] = useState(false);
    const [quantityState, setQuantity] = useState(quantity);
    const [priceState, setPrice] = useState(price ?? 0);
    const [isWeighableState, setIsWeighable] = useState(isWeighable);

    const computTotal = (price = priceState) => {
        return (price * quantityState).toFixed(2)
    }
    const updateProductsPriceList = (productTotalPrice) => {
        setProductsPriceList((prevList) => {
            return {...prevList, [id]: productTotalPrice}
        });
    }

    return (
        <Card style={[styles.cardStyle, isAddState && styles.cardChecked]}>
            <View style={styles.row1}>
                <View style={styles.checkBoxContainer}>
                    <Pressable
                        style={[styles.checkBox, isAddState && styles.checkBoxActive]}
                        onPress={() => setIsAdd(!isAddState)}
                    >
                        <Image 
                            source={require("@/assets/images/check.png")} 
                            style={[styles.checkIcon, isAddState && styles.checkIconActive]} 
                        />
                    </Pressable>
                </View>
                <ThemedText style={styles.quantityText}>
                    {quantityState}x
                </ThemedText>
                <ThemedText style={styles.productName}>
                    {nameState}
                </ThemedText>
                <View style={styles.removeButtonContainer}>
                    <Pressable onPress={() => removeProduct(id)} style={styles.removeButton}>
                        <Entypo name="circle-with-cross" size={24} color="white" />
                    </Pressable>
                </View>
            </View>
            <View style={styles.row2}>
                <View style={styles.priceContainer}>
                    <TextInput 
                    value={priceState} 
                    keyboardType="decimal-pad" 
                    style={styles.priceInput} 
                    onChangeText={(text) => {
                        const reformatText = parseFloat(text.replace(/,/g, '.'));
                        setPrice(reformatText);
                        if(typeof reformatText === "number" && !isNaN(reformatText)) {
                            updateProductsPriceList(computTotal(reformatText));
                        }
                    }}
                    placeholder="Prix"
                    placeholderTextColor={colors.grayLight}
                    />
                    <ThemedText style={styles.unitPrice}>
                        €/unité
                    </ThemedText>
                </View>
            </View>
            <View style={styles.row3}>
                <ThemedText color="primary" style={styles.totalPrice}>
                    Total : {computTotal()} €
                </ThemedText>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    cardStyle: {
        flexDirection: "column",
        padding: 10,
        backgroundColor: colors.backgroundVariant,
        borderRadius: 10,
        marginVertical: 5,
        width: "100%",
        gap: 13,
    },
    row3: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: 4
    },
    row2: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end"
    },
    row1: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15
    },
    cardChecked: {
        opacity: 0.6,
        backgroundColor: colors.grayDark,
    },
    checkBoxContainer: {
        width: "10%",
        justifyContent: "center",
        alignItems: "center",
    },
    checkBox: {
        padding: 5,
        borderRadius: 5,
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.grayLight,
    },
    checkBoxActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    checkIcon: {
        width: 20,
        height: 20,
        opacity: 0,
    },
    checkIconActive: {
        opacity: 1,
    },
    productInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        width: "40%",
    },
    quantityText: {
        fontSize: 18,
        lineHeight: 20,
        fontWeight: 900
    },
    totalPrice: {
        fontSize: 18
    },
    productName: {
        fontSize: 20,
        color: colors.white,
        width: "63%"
    },
    priceContentBlock: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        alignItems: "flex-start"
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
       padding: 5,
       backgroundColor: colors.inputBackgroundColor,
       paddingRight: 10,
       borderRadius: 10,
       borderColor: colors.grayLight,
       borderWidth: 1,
    },
    priceInput: {
        color: colors.white,
        width: 60,
        fontSize: 18
    },
    unitPrice: {
        fontSize: 18,
        color: colors.grayLight,
    },
    removeButtonContainer: {
        marginLeft: "auto"
    },
    removeButton: {
        padding: 5,
    },
    removeIcon: {
        width: 20,
        height: 20,
    },
});