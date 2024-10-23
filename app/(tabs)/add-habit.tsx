import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
  View,
} from "react-native";
import Header from "../../components/Header";
import Form from "../../components/habits/Form";
import { db } from "../../config/firebaseConfig";
import { doc, collection, setDoc, getDocs } from "firebase/firestore";
import useUserStore from "@/stores/userStore";
import { showMessage } from "react-native-flash-message"; // Importar Flash Message
import LoadingIndicator from "@/components/LoadingIndicator"; // Importar el componente de indicador de carga
import useCategoriesStore from "@/stores/categoriesStore";
interface HabitFormData {
  title: string;
  description: string;
  importanceId: string;
}


export default function AddHabit() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Estado de carga para la creación del hábito
  const { email, validToken } = useUserStore(); // Obtener el email del store
  const { getPriorityLevel, categories,setSelectedCategory } = useCategoriesStore(); // Obtener la función `getPriorityLevel` del store

  const onSubmit = async (data: HabitFormData, reset: () => void) => {
    if (!email || !validToken()) {
      showMessage({
        message: "Error",
        description: "No se pudo obtener el ID del usuario.",
        type: "danger",
      });
      return;
    }

    setIsSubmitting(true); // Inicia el estado de carga para la creación del hábito

    try {
      const habitDoc = doc(collection(db, "habits")); // Crear referencia para un nuevo documento
      const newHabit = {
        ...data,
        userID: email, // Asigna el email del usuario
        createdAt: new Date(), // Fecha de creación
        updatedAt: new Date(), // Fecha de actualización
        deleted: false, // Estado de eliminación por defecto
        priorityLevel: getPriorityLevel(data.importanceId), // Asignar nivel de prioridad
      };
      await setDoc(habitDoc, newHabit); // Guardar el hábito en Firebase

      showMessage({
        message: "Éxito",
        description: "El hábito se ha guardado correctamente.",
        type: "success",
      });

      reset(); // Limpiar el formulario
    } catch (error) {
      console.error("Error al guardar el hábito:", error);
      showMessage({
        message: "Error",
        description: "Hubo un error al guardar el hábito.",
        type: "danger",
      });
    } finally {
      setIsSubmitting(false); // Finaliza el estado de carga para la creación del hábito
      setSelectedCategory(null);

    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isSubmitting || categories.length == 0 ? ( // Mostrar el indicador de carga mientras se envía el formulario
        <LoadingIndicator />
      ) : (
        <View>
          <Header title="Agregar hábito" />
          <Form
            onSubmit={onSubmit} // Enviamos la función `onSubmit`
            categories={categories}
            isLoading={categories.length === 0} // Controlar la carga de las categorías
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 10,
    flex: 1,
  },
});
