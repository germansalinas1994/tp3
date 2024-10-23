import {
  View,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import Header from "../../components/Header";
import Form from "../../components/habits/Form";
import LoadingIndicator from "@/components/LoadingIndicator";
import { showMessage } from "react-native-flash-message";
import useCategoriesStore from "@/stores/categoriesStore"; // Importa el store de categorías

interface Habit {
  id: string;
  title: string;
  description: string;
  importanceId: string;
}

export default function HabitDetails() {
  const { habitId } = useLocalSearchParams();
  const [habitData, setHabitData] = useState<Habit | null>(null); // Manejo del hábito
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { categories, getPriorityLevel, setSelectedCategory } =
    useCategoriesStore(); // Usamos el store de categorías

  useEffect(() => {
    if (habitId) {
      fetchHabitData(habitId.toString());
    }
  }, [habitId]);

  const fetchHabitData = async (habitId: string) => {
    try {
      const habitRef = doc(db, "habits", habitId);
      const habitSnapshot = await getDoc(habitRef);

      if (habitSnapshot.exists()) {
        setHabitData({
          id: habitSnapshot.id,
          ...habitSnapshot.data(),
        } as Habit);
      } else {
        showMessage({
          message: "Error",
          description: "No se encontró el hábito.",
          type: "danger",
        });
      }
    } catch (error) {
      console.error("Error al recuperar el hábito:", error);
      showMessage({
        message: "Error",
        description: "Hubo un error al recuperar el hábito.",
        type: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateHabit = async (data: Habit, reset: () => void) => {
    setIsLoading(true);
    try {
      const habitRef = doc(db, "habits", habitId as string); // Referencia al documento
      const priorityLevel = getPriorityLevel(data.importanceId);

      await setDoc(
        habitRef,
        { ...data, priorityLevel, updatedAt: new Date() },
        { merge: true }
      ); // Actualizar el hábito

      showMessage({
        message: "Éxito",
        description: "El hábito se ha actualizado correctamente.",
        type: "success",
      });

      reset(); // Resetear el formulario después de la actualización
      router.replace("/home"); // Redirigir a la pantalla de Home
    } catch (error) {
      console.error("Error al actualizar el hábito:", error);
      showMessage({
        message: "Error",
        description: "Hubo un error al actualizar el hábito.",
        type: "danger",
      });
    } finally {
      setIsLoading(false);
      setSelectedCategory(null); // Limpiar la categoría seleccionada

    }
  };

  if (!habitData) {
    return <LoadingIndicator />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header showBackButton={true} title="Actualizar hábito" />
      <Form
        onSubmit={handleUpdateHabit}
        categories={categories} // Pasamos las categorías desde el store
        isLoading={isLoading} // No estamos cargando categorías en el formulario
        defaultValues={habitData} // Pasar los valores del hábito al formulario
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 10,
    flex: 1,
  },
});
