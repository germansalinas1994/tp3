import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Importar los iconos
import SkeletonItem from "@/components/SkeletonItem";
import Colors from "@/constants/Colors";
import { useRouter, Link } from "expo-router";

interface Habit {
  id: string;
  title: string;
  description: string;
  importanceId: string;
}

interface HabitsListProps {
  habits: Habit[];
  isLoading: boolean;
  isLoaded: boolean;
  selectedCategory: string | null; 
  onDeleteHabit: (habitId: string) => void;
}

export default function HabitsList({
  habits,
  isLoading,
  isLoaded,
  selectedCategory,
  onDeleteHabit,
}: HabitsListProps) {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {isLoading  || isLoaded ? (
        // Mostrar SkeletonItem mientras isLoading sea true
        <View>
          {Array.from({ length: 10 }).map((_, index) => (
            <SkeletonItem
              key={index}
              width={"100%"}
              height={60}
              borderRadius={10}
              style={styles.skeleton}
            />
          ))}
        </View>
      ) : habits.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {selectedCategory
              ? "No se han encontrado hábitos en esta categoría"
              : "Aún no has cargado hábitos"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={habits}
          renderItem={({ item }) => (
            <Link
              href={{
                pathname: "/habits-details/[habitId]",
                params: { habitId: item.id },
              }}
              asChild
            >
              <TouchableOpacity>
                <View style={styles.listItem}>
                  <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.importance}>
                      Prioridad: {item.importanceId}
                    </Text>
                    <Text style={styles.description}>{item.description}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => onDeleteHabit(item.id)}
                    style={styles.deleteButton}
                  >
                    <MaterialIcons name="delete" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Link>
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  listItem: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: Colors.background.paper,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.background.paper,
    flexDirection: "row",
    justifyContent: "space-between", // Añadir espacio entre texto y botón
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  deleteButton: {
    marginLeft: 10,
  },
  title: {
    fontFamily: "outfit-medium",
    fontSize: 18,
    color: Colors.text.primary,
  },
  description: {
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.text.secondary,
  },
  importance: {
    fontFamily: "outfit",
    fontSize: 15,
    marginVertical: 2,
    color: Colors.text.primary,
  },
  skeleton: {
    marginBottom: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontFamily: "outfit-medium",
    fontSize: 18,
    color: Colors.text.primary,
  },
});
