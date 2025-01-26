import { useState } from "react";
import Card from "./Card";
import useColor from "@/hook/useColor";
import { Image, Pressable, StyleSheet, TextInput, View } from "react-native";
import ThemedText from "./ThemedText";
const colors = useColor();

export function ProductCard({id, name, quantity, price, isWeighable, removeProduct}) {
    const [nameState, setName] = useState(name);
    const [isAddState, setIsAdd] = useState(false);
    const [quantityState, setQuantity] = useState(quantity);
    const [priceState, setPrice] = useState(price ?? null);
    const [isWeighableState, setIsWeighable] = useState(isWeighable);
    return (
        <Card style={styles.cardStyle}>
            <View style={{width: "10%", margin: "auto"}}>
                <Pressable
                style={(isAddState && styles.checkBoxActive) || styles.checkBoxInnactive}
                onPress={ () => setIsAdd(!isAddState)}
                >
                        <Image source={require("@/assets/images/check.png")} style={{width: "100%", height: "100%", opacity: isAddState && 1 || 0 }} />
                </Pressable>
            </View>
            <View style={{flexDirection: "row", alignItems: "center", gap: 7, width: "55%", justifyContent: "center"}}>
                <ThemedText variant="heading1" style={{fontSize: 20}}>
                    {quantityState}x
                </ThemedText>
                <ThemedText style={{fontSize: 20}}>
                    {nameState}
                </ThemedText>
            </View>
            <View style={{flexDirection: "row", gap: 4, alignItems: "center", width: "25%"}}>
                <TextInput value={price} keyboardType="number-pad" style={styles.priceInput} />
                <ThemedText style={{fontSize: 20}} variant="heading2">
                    €
                </ThemedText>
            </View>
            <View style={{width: "10%", margin: "auto"}}>
                <Pressable onPress={() => removeProduct(id)} style={{borderRadius: 7, backgroundColor: colors.danger, padding: 3.75}}>
                    <Image source={require("@/assets/images/remove.png")} style={{width: 25, height: 27}} />
                </Pressable>
            </View>
        </Card>
    )
}

const styles = StyleSheet.create({
    priceInput: {
        backgroundColor: colors.black,
        borderRadius: 50,
        borderColor: colors.grayLight,
        color: colors.white,
        padding: 5,
        width: 50,
        textAlign: "center"
    },
    cardStyle: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 40,
        backgroundColor: colors.backgroundVariant,
        width: "100%"
    },
    checkBoxActive: {
        padding: 3.75,
        borderRadius: 5,
        width: 30,
        height: 30,
        backgroundColor: colors.primary,
    },
    checkBoxInnactive: {
        padding: 3.75,
        borderRadius: 5,
        backgroundColor: colors.black,
        borderColor: colors.grayLight,
        borderWidth: 1,
        width: 30,
        height: 30,
    }
})