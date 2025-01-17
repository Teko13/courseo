import useColor from "@/hook/useColor";
import { StyleSheet, Text } from "react-native";

const colors = useColor();
export default function ThemedText({variant, style, color, ...rest}) {
    return <Text style={[styles[variant ?? "body"], style, {color: colors[color ?? "white"]}]} {...rest} />
}
const styles = StyleSheet.create({
    body: {
        fontSize: 14,
    },
    heading1: {
        lineHeight: 32,
        fontWeight: 900,
        padding: 5,
        fontSize: 35
    },
    heading2: {
        lineHeight: 32,
        padding: 3,
        fontWeight: 900,
        fontSize: 24
    },
})