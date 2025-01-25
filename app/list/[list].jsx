import Card from "@/components/Card";
import { ProductCard } from "@/components/Product";
import RadioButton from "@/components/RadioButton";
import { ThemedButton } from "@/components/ThemedButton";
import ThemedText from "@/components/ThemedText";
import useColor from "@/hook/useColor";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, FlatList, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const colors = useColor();

export default function List() {
    // id, name, quantity, price, isWeighable, isAdd
    const initFormValue = {
        id: "",
        name: "",
        quantity: "1",
        isWeighable: false
    }
    const [formData, setFormData] = useState(initFormValue);
    const [visibility, setVisibility] = useState(false);
    const [productData, setProductData] = useState([]);
    const handleSubmit = () => {
        if(formData.quantity <= 0) {
            Alert.alert("Attention", "Ajoutez une quantité a votre produit")
        } else if(formData.name == "") {
            Alert.alert("Attention", "Présisez le nom de votre produit");
        } else {
            setProductData((prevProduct) => ([...prevProduct, formData]))
            setFormData(initFormValue);
            setVisibility(false);
        }
    }
    const handleWeighableOptionSelect = (option) => {
        setFormData((prevFormData) => ({...prevFormData, isWeighable: option}))
    };
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
                <Pressable onPress={() => setVisibility(true)} style={{width: "100%"}}>
                    <ThemedButton style={{marginVertical: 10, width: "100%"}}>
                        Ajouter un produit
                    </ThemedButton>
                </Pressable>
                <Modal
                visible={visibility} 
                animationType="fade" 
                onRequestClose={() => setVisibility(false)} 
                transparent={true} 
                >
                    <View style={styles.modal}>
                        <View style={styles.modalFormContainer}>
                            <TextInput 
                            placeholderTextColor={colors.grayLight}
                            style={styles.inputStyle}
                            placeholder="Nom du produit"
                            value={formData.name} 
                            onChangeText={(text) => setFormData((prevFormData) => ({...prevFormData, name: text}))}
                            />
                            <TextInput 
                            placeholderTextColor={colors.grayLight}
                            style={styles.inputStyle}
                            placeholder="Quantité"
                            keyboardType="numeric"
                            value={formData.quantity}
                            onChangeText={(value) => setFormData({...formData, quantity: value})} 
                            />
                            <View style={styles.isWeighableStyle}>
                                <ThemedText>Ce produit est à peser ?</ThemedText>
                                <View style={{flexDirection: "row", alignItems: "center", gap: 40}}>
                                    <TouchableOpacity style={styles.touchableOptionStyle} onPress={() => handleWeighableOptionSelect(true)}>
                                        <ThemedText>Oui</ThemedText>
                                        <RadioButton isSelected={formData.isWeighable} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.touchableOptionStyle} onPress={() => handleWeighableOptionSelect(false)}>
                                        <ThemedText>Non</ThemedText>
                                        <RadioButton isSelected={!formData.isWeighable} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{flexDirection: "row", paddingRight: 7, paddingTop: 7, gap: 30, width: "100%", justifyContent: "flex-end"}}>
                                <Pressable onPress={() => setVisibility(false)}>
                                    <ThemedText color="primary">Annuler</ThemedText>
                                </Pressable>
                                <Pressable onPress={() => handleSubmit()}>
                                    <ThemedText color="primary">Ajouter</ThemedText>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
            <Card style={{flex: 1, padding: 15, backgroundColor: colors.background, gap: 25, flexDirection: "colum"}}>
                <FlatList 
                data={productData}
                renderItem={({item}) => ( <ProductCard name={item.name} quantity={item.quantity} isWeighable={item.isWeighable} />)}
                keyExtractor={(product) => product.name} 
                contentContainerStyle={{gap: 10}}
                />
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
  },
  modal: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  modalFormContainer: {
    backgroundColor: colors.black,
    paddingHorizontal: 15,
    paddingVertical: 35,
    width: "95%",
    gap: 25,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 8
  },
  inputStyle: {
    backgroundColor: colors.background,
    paddingVertical: 5,
    paddingHorizontal: 0,
    borderBottomColor: colors.primary,
    borderBottomWidth: 2,
    color: colors.white,
    width: "100%"
  },
  isWeighableStyle: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  touchableOptionStyle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7
  }
})