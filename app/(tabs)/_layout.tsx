import React from "react";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "../../constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: Colors.text.disabled,
        tabBarActiveTintColor: Colors.secondary.dark,
      }}
    >
      {/* <Tabs.Screen name="home" options={{title:'Home',tabBarStyle: { display: 'none' } , tabBarIcon:() => <Ionicons name="home" size={24} color={Colors.secondary.contrastText} />}} /> */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Mis hábitos",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkbox-outline" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add-habit"
        options={{
          title: "Agregar hábito",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-circle" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
