// stores/categoriesStore.ts
import { create } from 'zustand';

// Definimos la interfaz para una categoría
interface Category {
  id: string;
  description: string;
}

// Definimos la interfaz para el store
interface CategoriesStore {
  categories: Category[]; // Estado de las categorías
  setCategories: (categories: Category[]) => void; // Función para setear las categorías
  getPriorityLevel: (importanceId: string) => number; // Función para obtener el nivel de prioridad
  selectedCategory: Category | null;
  setSelectedCategory: (category: Category | null) => void;

}

// Creamos el store usando Zustand
const useCategoriesStore = create<CategoriesStore>((set) => ({
  categories: [], // Estado inicial de las categorías
  setCategories: (categories) => set({ categories }),
  selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  // Función para obtener el nivel de prioridad basado en la descripción
  getPriorityLevel: (importanceId: string) => {
    switch (importanceId) {
      case 'Alta':
        return 1;
      case 'Media':
        return 2;
      case 'Baja':
        return 3;
      default:
        return 4; // Nivel por defecto
    }
  },
}));

export default useCategoriesStore;
