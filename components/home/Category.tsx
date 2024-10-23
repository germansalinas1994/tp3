// Componente Category
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import SkeletonItem from "../SkeletonItem";
import Colors from "@/constants/Colors";

interface Category {
  id: string;
  description: string;
}

interface CategoryProps {
  categories: Category[];
  selectedCategory: Category | null;
  onCategoryPress: (category: Category) => void;
  isLoaded: boolean;
}

export default function Category({
  categories,
  selectedCategory,
  onCategoryPress,
  isLoaded,
}: CategoryProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.titleText}>Categoría</Text>
        {isLoaded ? (
          <View style={styles.skeletonContainer}>
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonItem
                key={index}
                width={100}
                height={60}
                borderRadius={15}
                style={styles.skeletonItem}
              />
            ))}
          </View>
        ) : (
          <FlatList<Category>
            numColumns={3}
            data={categories}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.list,
                  selectedCategory?.id === item.id && styles.selectedCategory,
                ]}
                onPress={() => onCategoryPress(item)}
              >
                <Text
                  style={[
                    styles.textItem,
                    selectedCategory?.id === item.id && styles.selectedText,
                  ]}
                >
                  {item.description}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: 10,
  },
  container: {
    marginTop: 20,
    padding: 10,
  },
  titleText: {
    fontFamily: "outfit-medium",
    fontSize: 19,
    fontWeight: "bold",
  },
  list: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 15,
    backgroundColor: Colors.background.yellow,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: Colors.secondary.light,
    margin: 5,
  },
  textItem: {
    fontFamily: "outfit",
    fontSize: 20,
    textAlign: "center",
  },
  selectedCategory: {
    backgroundColor: Colors.secondary.light,
    borderColor: Colors.primary.contrastText,
  },
  selectedText: {
    fontWeight: "bold",
    color: Colors.primary.contrastText,
  },
  skeletonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  skeletonItem: {
    marginVertical: 10,
    marginHorizontal: 5,
  },
});
