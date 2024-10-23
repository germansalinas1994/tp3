import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useAuth0 } from "react-native-auth0";
import useUserStore from "@/stores/userStore";
import useCategoriesStore from "@/stores/categoriesStore"; // Importamos el store de categorías
import Header from "../../components/Header";
import Category from "../../components/home/Category";
import HabitsList from "@/components/home/HabitsList";
import { db } from "../../config/firebaseConfig";
import { showMessage } from "react-native-flash-message";
import LoadingIndicator from "@/components/LoadingIndicator";
import {
  doc,
  collection,
  setDoc,
  where,
  getDocs,
  query,
  onSnapshot,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { set } from "react-hook-form";

interface Category {
  id: string;
  description: string;
}

interface Habit {
  id: string;
  userId: string;
  importanceId: string;
  title: string;
  description: string;
}

export default function HomeScreen() {
  const { user } = useAuth0();
  const { setEmail, validToken, setIdUser, token, email } = useUserStore();
  const { categories, setCategories, selectedCategory, setSelectedCategory } =
    useCategoriesStore(); // Usamos el store de categorías

  const [habits, setHabits] = useState<Habit[]>([]);
  const [isDeletingHabit, setIsDeletingHabit] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadingHabits, setIsLoadingHabits] = useState(false);

  // Llamamos los hooks en el mismo orden, siempre
  useEffect(() => {
    if (token && validToken()) {
      fetchData();
    }
  }, [token]); // Solo se ejecuta cuando el token cambia

  // Evitar retorno condicionales o hooks dentro de condicionales
  const fetchData = async () => {
    setIsLoaded(true);
    setIsLoadingHabits(true);
    try {
      await getAccessToken();
      if (categories.length === 0) {
        await getCategories();
      }
    } catch (error) {
      console.error("Error al obtener el token o las categorías:", error);
    } finally {
      setIsLoaded(false);
      setIsLoadingHabits(false);
    }
  };

  const getAccessToken = async () => {
    try {
      if (validToken()) {
        await checkOrCreateUser(user?.email || "", { name: user?.name || "" });
      } else {
        throw new Error("El token no es válido");
      }
    } catch (error) {
      console.log("Error al obtener el token:", error);
    }
  };

  const checkOrCreateUser = async (
    email: string,
    userData: { name: string }
  ) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        const newUser = doc(usersRef);
        await setDoc(newUser, {
          email: email,
          name: userData.name,
          createdAt: new Date(),
        });

        setIdUser(newUser.id);
      } else {
        const userDoc = querySnapshot.docs[0];
        setIdUser(userDoc.id);
      }

      setEmail(email);
    } catch (error) {
      console.error(
        "Error al verificar o crear el usuario en Firebase:",
        error
      );
    }
  };

  // Obtener las categorías y almacenarlas en el store
  const getCategories = async () => {
    try {
      const categoriesCollection = await getDocs(collection(db, "importance"));
      const categoriesList: Category[] = categoriesCollection.docs.map(
        (doc) => ({
          id: doc.id,
          description: doc.data().description,
        })
      );
      setCategories(categoriesList); // Guardamos las categorías en el store
    } catch (error) {
      console.log("Error al obtener las categorías:", error);
    }
  };

  const handleCategoryPress = async (category: Category) => {
    try {
      if (selectedCategory?.id === category.id) {
        setSelectedCategory(null); // Deseleccionar si se hace clic en la misma categoría
      } else {
        setSelectedCategory(category); // Seleccionar la categoría
      }
      await fetchHabits(); // Espera a que los hábitos se carguen con el nuevo filtro
    } catch (error) {
      console.error("Error al seleccionar la categoría:", error);
    }
  };

  // Cargar hábitos cuando se selecciona una categoría o cambia el email
  useEffect(() => {
    if (email) {
      fetchHabits();
    }
  }, [selectedCategory, email]);

  const fetchHabits = async () => {
    try {
      await getHabits();
    } catch (error) {
      console.error("Error obteniendo los hábitos:", error);
    } 
  };

  const getHabits = async () => {
    try {
      setIsLoadingHabits(true); // Activa el estado de carga al inicio de la operación
  
      let q = query(
        collection(db, "habits"),
        where("userID", "==", email),
        where("deleted", "==", false),
        orderBy("priorityLevel", "asc")
      );
  
      // Aplicar filtro de categoría seleccionada si existe
      if (selectedCategory) {
        q = query(q, where("importanceId", "==", selectedCategory.description));
      }
  
      // Aquí suscribimos al stream en tiempo real de Firebase
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const habitsList: Habit[] = [];
  
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          habitsList.push({
            id: doc.id,
            userId: data.userID,
            title: data.title,
            description: data.description,
            importanceId: data.importanceId,
          });
        });
  
        // Actualizar el estado con los nuevos hábitos
        setHabits(habitsList);
  
        // Solo desactivar el estado de carga una vez que los hábitos se hayan actualizado
        setIsLoadingHabits(false); 
      });
  
      return unsubscribe; // No desactivamos aquí el estado de carga ya que los datos aún no han llegado
    } catch (error) {
      console.error("Error obteniendo los hábitos:", error);
      setIsLoadingHabits(false); // En caso de error, desactivamos el estado de carga
    }
  };
  
  const deleteHabit = async (habitId: string) => {
    setIsLoadingHabits(true);
    try {
      const habitRef = doc(db, "habits", habitId);
      await updateDoc(habitRef, {
        deleted: true,
        updatedAt: new Date(),
      });

      showMessage({
        message: "Éxito",
        description: "El hábito ha sido eliminado correctamente.",
        type: "success",
      });
    } catch (error) {
      console.error("Error al eliminar el hábito:", error);
      showMessage({
        message: "Error",
        description: "Hubo un error al eliminar el hábito.",
        type: "danger",
      });
    } finally {
      setIsLoadingHabits(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <Category
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryPress={handleCategoryPress}
        isLoaded={isLoaded}
      />

      <HabitsList
        habits={habits}
        isLoading={isLoadingHabits}
        isLoaded={isLoaded}
        onDeleteHabit={deleteHabit}
        selectedCategory={selectedCategory ? selectedCategory.id : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
