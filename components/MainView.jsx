import { StyleSheet, View } from "react-native";
import Card from "./Card";

export function MainView({style, ...rest}) {
    return (
        <View style={[styles.mainView, style]} {...rest} />
    )
}

export function MainViewCard({style, ...rest}) {
    return (
        <Card style={[styles.mainViewCard, style]} {...rest} />
    )
}

const styles = StyleSheet.create({

    mainView: {
        flex: 1,
        flexDirection: "column",
        alignContent: "center",
        gap: 20,
        marginTop: 40
    },
    mainViewCard: {
        flex: 1,
        padding: 8
    }
})