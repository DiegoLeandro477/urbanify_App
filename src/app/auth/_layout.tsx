import { Stack } from "expo-router";
import { SplashScreen } from "expo-router";
import { useEffect } from "react";

export default function authLayout() {
  useEffect(() => {
    // Oculta a tela de splash manualmente
    const hideSplash = async () => {
      await SplashScreen.preventAutoHideAsync();
      await SplashScreen.hideAsync();
    };
    hideSplash();
  }, []);
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login/index" />
    </Stack>
  );
}
