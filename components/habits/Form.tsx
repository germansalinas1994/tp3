import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { RadioButton, TextInput, HelperText } from "react-native-paper";
import SkeletonItem from "@/components/SkeletonItem";
import Colors from "@/constants/Colors";

interface HabitFormData {
  id : string;
  title: string;
  description: string;
  importanceId: string;
}

interface FormProps {
  onSubmit: (data: HabitFormData, reset: () => void) => void;
  categories: { id: string; description: string }[];
  isLoading: boolean;
  defaultValues?: HabitFormData; // Agregamos defaultValues opcional
}

export default function Form({
  onSubmit,
  categories,
  isLoading,
  defaultValues,
}: FormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<HabitFormData>({
    defaultValues: defaultValues || {
      title: "",
      description: "",
      importanceId: "",
    },
  });

  if (isLoading) {
    return (
      <View style={styles.inputContainer}>
        <SkeletonItem
          width="100%"
          height={40}
          borderRadius={8}
          style={{ marginBottom: 10 }}
        />
        <SkeletonItem
          width="100%"
          height={40}
          borderRadius={8}
          style={{ marginBottom: 10 }}
        />
        <SkeletonItem width="100%" height={60} borderRadius={8} />
      </View>
    );
  }

  return (
    <View style={styles.inputContainer}>
      {/* Título */}
      <Text style={styles.label}>Título *</Text>
      <Controller
        control={control}
        name="title"
        rules={{ required: "El título es obligatorio" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            onChangeText={onChange}
            value={value}
            mode="outlined"
            error={!!errors.title}
          />
        )}
      />
      {errors.title?.message && (
        <HelperText type="error">{errors.title.message}</HelperText>
      )}

      {/* Descripción */}
      <Text style={styles.label}>Descripción *</Text>
      <Controller
        control={control}
        name="description"
        rules={{ required: "La descripción es obligatoria" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            onChangeText={onChange}
            value={value}
            mode="outlined"
            error={!!errors.description}
          />
        )}
      />
      {errors.description?.message && (
        <HelperText type="error">{errors.description.message}</HelperText>
      )}

      {/* Prioridad con RadioButton */}
      <Text style={styles.label}>Prioridad *</Text>
      <Controller
        control={control}
        name="importanceId"
        rules={{ required: "La prioridad es obligatoria" }}
        render={({ field: { onChange, value } }) => (
          <RadioButton.Group onValueChange={onChange} value={value}>
            <View style={styles.radioContainer}>
              {categories.map((category) => (
                <RadioButton.Item
                  key={category.id}
                  label={category.description}
                  value={category.description}
                />
              ))}
            </View>
          </RadioButton.Group>
        )}
      />
      {errors.importanceId?.message && (
        <HelperText type="error">{errors.importanceId.message}</HelperText>
      )}

      <View style={styles.inputContainer}>
        {/* Resto del código igual */}
        <TouchableOpacity
          onPress={handleSubmit((data) => onSubmit(data, reset))}
          style={styles.submitButton}
        >
          <Text style={styles.buttonText}>
            {defaultValues ? "Actualizar Hábito" : "Guardar Hábito"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    padding: 10,
    marginTop: "8%",
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
    fontFamily: "outfit",
  },
  input: {
    backgroundColor: Colors.background.paper,
    borderRadius: 10,
    fontFamily: "outfit",
  },
  radioContainer: {
    marginVertical: 10,
    backgroundColor: Colors.background.paper,
    borderWidth: 1,
    borderColor: Colors.background.primaryButton,
    borderRadius: 10,
    padding: 5,
  },
  submitButton: {
    padding: 8,
    width: "50%",
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: Colors.background.primaryButton,
  },
  buttonText: {
    textAlign: "center",
    padding: 10,
    color: Colors.text.white,
    fontSize: 16,
    fontFamily: "outfit-medium",
  },
});
