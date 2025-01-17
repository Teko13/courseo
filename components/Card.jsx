import useColor from "@/hook/useColor";
import { View } from "react-native";

const colors = useColor();
export default function Card({style, ...rest}) {
    return (
        <View style={[style, {borderRadius: 8}]} {...rest} />
    )
}