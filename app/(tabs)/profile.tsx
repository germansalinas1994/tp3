// Profile.tsx
import React from "react";
import { SafeAreaView, View, StyleSheet, StatusBar, Platform, Text } from "react-native";
import UserProfile from "@/components/profile/UserProfile";
import ProfileMenu from "@/components/profile/ProfileMenu";
import useUserStore from "@/stores/userStore";
import useCategoriesStore from "@/stores/categoriesStore";
import { useAuth0 } from "react-native-auth0";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Header from "@/components/Header";

interface MenuItem {
  id: number;
  name: string;
  icon: keyof typeof Ionicons.glyphMap; // Tipamos icon para que solo acepte íconos válidos
  path: string;
}

export default function Profile() {
  const { name, imagen, email, clearUser } = useUserStore();
  const { clearSession } = useAuth0();
  const router = useRouter();
  const {setSelectedCategory} = useCategoriesStore();



  const menuItems: MenuItem[] = [
    { id: 1, name: "Ver hábitos", icon: "list", path: "/home" },
    { id: 2, name: "Agregar hábito", icon: "add-circle", path: "/add-habit" },
    { id: 3, name: "Cerrar sesión", icon: "exit", path: "logout" },
  ];

  const onPressMenu = async (item: any) => {
    if (item.path === "logout") {
      try {
        await clearSession();
        clearUser();
        setSelectedCategory(null);
        router.replace("/");
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    } else {
      router.push(item.path as any);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
        <Header showBackButton={false} title="Perfil" />
        <UserProfile
          name={name || "Usuario Desconocido"}
          imageUri={imagen}
          email={email || "No hay correo disponible"}
        />
        <ProfileMenu menuItems={menuItems} onPressMenu={onPressMenu} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 10,
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontFamily: "outfit-medium",
    fontWeight: "bold",
  },
});
