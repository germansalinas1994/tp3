import React, { useEffect } from "react";
import { View, Text, Pressable, Dimensions, StyleSheet, Image } from "react-native";
import Colors from "../constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth0 } from 'react-native-auth0'; // Importa Auth0
import { useRouter } from 'expo-router'; // Para manejar la navegación
import LoadingIndicator from '../components/LoadingIndicator'; 
import useUserStore from "@/stores/userStore";

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { authorize, user, isLoading,getCredentials } = useAuth0();
  const { token, validToken, setToken, setImagen, setIsAuthenticated, setName } = useUserStore(); // Accede al token y funciones de Zustand

  const router = useRouter(); 

  useEffect(() => {
    // Si ya hay un token válido, redirigimos a la pantalla de inicio directamente
    const checkAuth = async () => {
      if (token && validToken()) {
        router.replace("/(tabs)/home");
      } else if (user) {
        await setGlobalUser(); // Configuramos el usuario globalmente
        router.replace("/(tabs)/home");
      }
    };
  
    // Asegúrate de que el router esté montado antes de intentar redirigir
    if (router) {
      checkAuth();
    }
  }, [user, token]);

  
  const setGlobalUser = async () => {
    try {
      // obtenemos las credenciales del usuario
      const credentials = await getCredentials();    
      if (credentials?.idToken) {
        setToken(credentials.idToken); // Guarda el token
        const userPicture = user?.picture ?? ""; // Guarda la imagen del usuario
        setImagen(userPicture); // Guarda la imagen en Zustand
        setIsAuthenticated(true); // Cambia el estado de autenticación
        setName(user?.name ?? ""); // Guarda el nombre
      }
    } catch (error) {
      console.log("Error al autorizar:", error);
    }
  };

  const handleLogin = async () => {
    try {
      //el authorize hace que se abra la pantalla de login de Auth0
      await authorize(); // Iniciar sesión con Auth0
    } catch (error) {
      console.log('Login error:', error);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <View style={styles.content}>
        <Image
          source={require("../assets/images/habitos.png")}
          style={styles.image}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>¿Listo para gestionar tus hábitos?</Text>
        <Text style={styles.subtitle}>
          Comienza ahora a mejorar tus hábitos diarios y alcanzar tus objetivos.
        </Text>
      
        {isLoading ? (
          <LoadingIndicator />  
        ) : !user ? (
          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </Pressable>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.paper,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.05, 
  },
  image: {
    width: width * 1,  
    height: height * 0.3, 
  },
  title: {
    fontFamily: "outfit-Bold",
    fontSize: width * 0.08,
    textAlign: "center",
    color: Colors.text.primary,
  },
  subtitle: {
    fontFamily: "outfit",
    fontSize: width * 0.05,
    textAlign: "center",
    color: Colors.text.primary,
    marginBottom: height * 0.02, 
  },
  button: {
    marginTop: height * 0.02, 
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.1,
    backgroundColor: Colors.secondary.main,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    fontFamily: "outfit-Medium",
    fontSize: width * 0.05,
    textAlign: "center",
    color: Colors.text.white,
  },
});
