import useColor from "@/hook/useColor";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function RadioButton({isSelected}) {
    return (
        <View style={styles.container}>
            <View style={[styles.selectedIndicator, {opacity: isSelected && 1 || 0}]} ></View>
        </View>
    )
}
const colors = useColor();
const styles = StyleSheet.create({
    container: {
        borderColor: colors.primary,
        borderWidth: 2,
        borderRadius: 100,
        padding: 4
    },
    selectedIndicator: {
        backgroundColor: colors.primary,
        width: 20,
        height: 20,
        borderRadius: 100
    }
})