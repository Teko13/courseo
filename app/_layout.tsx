import TabBar from "@/components/TabBar";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false, // Cacher les headers
        }}
      />
      <View>
        <TabBar />
      </View>
    </View>
  );
}
