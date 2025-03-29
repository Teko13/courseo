import ThemedText from "@/components/ThemedText";
import { getLists } from "@/db/query";
import useColor from "@/hook/useColor";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, Pressable, FlatList } from "react-native";

const colors = useColor();
export default function Archive() {
    const [listsData, setListsData] = useState([]);
    useEffect(() => {
      async function getData() {
        setListsData(await getLists());
      }
      getData();
    }, [])
    
    return (
        <SafeAreaView style={[styles.ontainer]}>
            <ThemedText variant="heading1" style={{padding: 15}}>
                Historique Des Courses
            </ThemedText>
            <View style={{padding: 5, marginTop: 30}}>
                <FlatList
                    data={listsData}
                    renderItem={({item}) => (
                        <Pressable onPress={() => router.push({pathname: "/list/[list]", params:{listId: item.id}})} style={styles.itemRow}>
                            <ThemedText variant="heading2">{item.name}</ThemedText>
                            <ThemedText style={{opacity: 0.7}}>{item.date}</ThemedText>
                        </Pressable>
                    )}
                    keyExtractor={(list) => list.id} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    ontainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  itemRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 5,
    borderTopColor: colors.backgroundVariant,
    borderTopWidth: 2,
  }
})