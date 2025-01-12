import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Cache les en-têtes pour toutes les pages
      }}
    >
      {/* Assurez-vous que seuls des Stack.Screen sont définis ici */}
      <Stack.Screen name="index" /> {/* Fichier app/index.js */}
    </Stack>
  );
}
