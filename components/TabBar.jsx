import useColor from "@/hook/useColor";
import { Link, router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"
import Entypo from "react-native-vector-icons/Entypo"

export default function TabBar() {
    const color = useColor();
    return (
        <View style={{width: "100vw", flexDirection: "row", backgroundColor: color.primary}}>
            <Pressable onPress={() => {router.replace("/")}} style={{paddingVertical: 8, display: "flex", width: "50%", justifyContent: "center", alignItems: "center", textAlign: 'center'}}>
                    <Icon name="home" size={24} color="white" />
            </Pressable>
            <Pressable onPress={() => router.push("/archive")} style={{paddingVertical: 8, width: "50%", justifyContent: "center", alignItems: "center", textAlign: "center"}}>
                    <Entypo name="archive" size={24} color="white" />
            </Pressable>
        </View>
    )
}