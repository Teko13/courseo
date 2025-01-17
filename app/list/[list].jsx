import Card from "@/components/Card";
import { ProductCard } from "@/components/Product";
import { ThemedButton } from "@/components/ThemedButton";
import ThemedText from "@/components/ThemedText";
import useColor from "@/hook/useColor";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const colors = useColor();

export default function List() {
    const data = [
        {
            name: "lait",
            quantity: 1,
            isWeighable: false,
            isAdd: false
        },
        {
            name: "oeuf",
            quantity: 1,
            isWeighable: false,
            isAdd: true
        },
        {
            name: "sel",
            quantity: 1,
            isWeighable: false,
            isAdd: false
        },
        {
            name: "Chips",
            quantity: 5,
            isWeighable: true,
            isAdd: false
        },
        {
            name: "oignon",
            quantity: 3,
            isWeighable: true,
            isAdd: false
        },
        {
            name: "choux",
            quantity: 3,
            isWeighable: true,
            isAdd: false
        }
    ]
    const params = useLocalSearchParams();
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerStyle}>
                <ThemedText variant="heading1">
                    {params.list}
                </ThemedText>
                <ThemedText variant="heading2" color="primary">
                    Total des courses: 56 €
                </ThemedText>
                <ThemedButton style={{marginVertical: 10, width: "100%"}}>
                    Ajouter un produit
                </ThemedButton>
            </View>
            <Card style={{flex: 1, padding: 15, backgroundColor: colors.background, gap: 25, flexDirection: "colum"}}>
                {
                    data.map((product, idx) => (<ProductCard key={idx} name={product.name} quantity={product.quantity} isWeighable={product.isWeighable} isAdd={product.isAdd} />))
                }
            </Card>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  headerStyle: {
    width: "100%",
    flexDirection: 'column',
    alignItems: "center",
    paddingTop: 70,
    paddingHorizontal: 5,
  }
})