
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { WidgetProvider } from "@/contexts/WidgetContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SystemBars } from "react-native-edge-to-edge";
import { useNetworkState } from "expo-network";
import { useColorScheme, Alert } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import React, { useEffect } from "react";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const colorScheme = useColorScheme();
  const networkState = useNetworkState();

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <WidgetProvider>
            <SystemBars style="auto" />
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="welcome" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="register" options={{ headerShown: false }} />
              <Stack.Screen 
                name="hauler/background-check" 
                options={{ 
                  title: "Background Check",
                  headerBackTitle: "Back"
                }} 
              />
              <Stack.Screen 
                name="hauler/documents" 
                options={{ 
                  title: "Upload Documents",
                  headerBackTitle: "Back"
                }} 
              />
              <Stack.Screen 
                name="hauler/onboarding" 
                options={{ 
                  title: "Complete Onboarding",
                  headerBackTitle: "Back"
                }} 
              />
              <Stack.Screen 
                name="hauler/subscription" 
                options={{ 
                  title: "Choose Subscription",
                  headerBackTitle: "Back"
                }} 
              />
              <Stack.Screen name="modal" options={{ presentation: "modal" }} />
              <Stack.Screen
                name="formsheet"
                options={{
                  presentation: "formSheet",
                  sheetAllowedDetents: [0.5, 1],
                  sheetGrabberVisible: true,
                }}
              />
              <Stack.Screen
                name="transparent-modal"
                options={{
                  presentation: "transparentModal",
                  animation: "fade",
                  headerShown: false,
                }}
              />
            </Stack>
            <StatusBar style="auto" />
          </WidgetProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
