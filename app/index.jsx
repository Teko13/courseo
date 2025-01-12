import { StyleSheet, Text, View } from "react-native"

export default function Index() {
    return (
        <View style={styles.container}>
        <Text>
            Hello word
        </Text>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 4,
        backgroundColor: "#DC0A2D"
    }
})