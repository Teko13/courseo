import useColor from "@/hook/useColor";
import { StyleSheet, Text } from "react-native";

const colors = useColor();
export function ThemedButton({style, ...rest}) {
    return (
        <Text style={[styles.button, style]} {...rest} />
    )
}

const styles = StyleSheet.create({
    button: {
        padding: 10,
        backgroundColor: colors.primary,
        borderRadius: 50,
        color: colors.white,
        fontSize: 16,
        fontWeight: 900,
        textAlign: 'center'
    }
})