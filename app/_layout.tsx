import { Stack } from "expo-router";
import { Auth0Provider } from "react-native-auth0";
import { useFonts } from "expo-font";
import LoadingIndicator from "@/components/LoadingIndicator";
import FlashMessage from "react-native-flash-message";
import { View } from "react-native";

export default function RootLayout() {
  const domain: string | undefined = process.env.EXPO_PUBLIC_DOMAIN;
  const clientID: string | undefined = process.env.EXPO_PUBLIC_CLIENT_ID;

  const [fontsLoaded] = useFonts({
    outfit: require("../assets/fonts/Outfit-Regular.ttf"),
    "outfit-Bold": require("../assets/fonts/Outfit-Bold.ttf"),
    "outfit-Medium": require("../assets/fonts/Outfit-Medium.ttf"),
  });

  if (!domain || !clientID) {
    console.error("Missing Auth0 configuration in environment variables");
    return null;
  }

  if (!fontsLoaded) {
    return <LoadingIndicator />;
  } else {
    return (
      <Auth0Provider domain={domain} clientId={clientID}>
        {/*Auth0Provider tiene que tener un único hijo */}
        <View style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="habits-details/[habitId]"
              options={{ headerShown: false }}
            />
          </Stack>

          <FlashMessage position="top" />
        </View>
      </Auth0Provider>
    );
  }
}
