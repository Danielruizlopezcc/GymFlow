import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList,
  ScrollView, StatusBar, ActivityIndicator, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { storage } from '@/src/utils/storage';
import { COLORS, BODY_PART_COLORS, BODY_PART_ICONS } from '@/src/constants/theme';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface Exercise {
  exercise_id: string;
  name: string;
  body_part: string;
  target: string;
  equipment: string;
}

interface WorkoutExercise {
  exercise_id: string;
  name: string;
  sets: number;
  reps: string;
  weight: number | null;
  notes: string;
}

export default function CreateWorkoutScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const [workoutName, setWorkoutName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>([]);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const fetchExercises = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      const resp = await fetch(`${BACKEND_URL}/api/exercises?${params.toString()}`);
      const data = await resp.json();
      setExercises(data.exercises || []);
    } catch (e) {
      console.error('Fetch exercises error:', e);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (showExercisePicker) {
      const debounce = setTimeout(fetchExercises, 300);
      return () => clearTimeout(debounce);
    }
  }, [showExercisePicker, searchQuery]);

  const addExercise = (exercise: Exercise) => {
    if (selectedExercises.find(e => e.exercise_id === exercise.exercise_id)) return;
    setSelectedExercises(prev => [...prev, {
      exercise_id: exercise.exercise_id,
      name: exercise.name,
      sets: 3,
      reps: '10',
      weight: null,
      notes: '',
    }]);
    setShowExercisePicker(false);
    setSearchQuery('');
  };

  const removeExercise = (exerciseId: string) => {
    setSelectedExercises(prev => prev.filter(e => e.exercise_id !== exerciseId));
  };

  const updateExercise = (exerciseId: string, field: string, value: any) => {
    setSelectedExercises(prev => prev.map(e =>
      e.exercise_id === exerciseId ? { ...e, [field]: value } : e
    ));
  };

  const saveWorkout = async () => {
    if (!workoutName.trim()) {
      Alert.alert('Error', 'Please enter a workout name');
      return;
    }
    setSaving(true);
    try {
      const token = await storage.secureGet('session_token', '');
      const resp = await fetch(`${BACKEND_URL}/api/workouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: date || new Date().toISOString().split('T')[0],
          name: workoutName.trim(),
          exercises: selectedExercises,
        }),
      });
      if (resp.ok) {
        router.back();
      } else {
        const err = await resp.json();
        Alert.alert('Error', err.error || 'Failed to save workout');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to save workout');
    } finally {
      setSaving(false);
    }
  };

  const formattedDate = date
    ? new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
    : 'Today';

  if (showExercisePicker) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]} testID="exercise-picker-screen">
        <StatusBar barStyle="dark-content" />
        <View style={styles.pickerHeader}>
          <TouchableOpacity testID="close-picker-btn" onPress={() => { setShowExercisePicker(false); setSearchQuery(''); }}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.pickerTitle}>Add Exercise</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.pickerSearch}>
          <Ionicons name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            testID="picker-search-input"
            style={styles.pickerSearchInput}
            placeholder="Search exercises..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        </View>
        <FlatList
          data={exercises}
          keyExtractor={(item) => item.exercise_id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          renderItem={({ item }) => {
            const isAdded = selectedExercises.some(e => e.exercise_id === item.exercise_id);
            const color = BODY_PART_COLORS[item.body_part] || COLORS.accent;
            return (
              <TouchableOpacity
                testID={`pick-exercise-${item.exercise_id}`}
                style={[styles.pickerItem, isAdded && styles.pickerItemAdded]}
                onPress={() => addExercise(item)}
                disabled={isAdded}
              >
                <View style={[styles.pickerItemIcon, { backgroundColor: color + '15' }]}>
                  <Ionicons name={(BODY_PART_ICONS[item.body_part] || 'barbell-outline') as any} size={22} color={color} />
                </View>
                <View style={styles.pickerItemInfo}>
                  <Text style={styles.pickerItemName}>{item.name}</Text>
                  <Text style={styles.pickerItemMeta}>{item.body_part} · {item.equipment}</Text>
                </View>
                {isAdded ? (
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
                ) : (
                  <Ionicons name="add-circle-outline" size={24} color={COLORS.accent} />
                )}
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.container, { paddingTop: insets.top }]} testID="create-workout-screen">
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity testID="close-create-btn" onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Workout</Text>
          <TouchableOpacity
            testID="save-workout-btn"
            onPress={saveWorkout}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color={COLORS.accent} />
            ) : (
              <Text style={[styles.saveText, !workoutName.trim() && { opacity: 0.4 }]}>Save</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Date */}
          <Text style={styles.dateText}>{formattedDate}</Text>

          {/* Workout Name */}
          <TextInput
            testID="workout-name-input"
            style={styles.nameInput}
            placeholder="Workout name (e.g. Push Day)"
            placeholderTextColor={COLORS.textSecondary}
            value={workoutName}
            onChangeText={setWorkoutName}
          />

          {/* Exercise List */}
          <View style={styles.exercisesSection}>
            <Text style={styles.sectionTitle}>EXERCISES</Text>
            {selectedExercises.map((ex, idx) => (
              <View key={ex.exercise_id} style={styles.exerciseRow} testID={`workout-exercise-${idx}`}>
                <View style={styles.exerciseRowHeader}>
                  <Text style={styles.exerciseRowName}>{ex.name}</Text>
                  <TouchableOpacity
                    testID={`remove-exercise-${idx}`}
                    onPress={() => removeExercise(ex.exercise_id)}
                  >
                    <Ionicons name="close-circle" size={22} color={COLORS.danger} />
                  </TouchableOpacity>
                </View>
                <View style={styles.exerciseRowConfig}>
                  <View style={styles.configItem}>
                    <Text style={styles.configLabel}>Sets</Text>
                    <View style={styles.configInputRow}>
                      <TouchableOpacity
                        onPress={() => updateExercise(ex.exercise_id, 'sets', Math.max(1, ex.sets - 1))}
                        style={styles.configBtn}
                      >
                        <Ionicons name="remove" size={16} color={COLORS.text} />
                      </TouchableOpacity>
                      <Text style={styles.configValue}>{ex.sets}</Text>
                      <TouchableOpacity
                        onPress={() => updateExercise(ex.exercise_id, 'sets', ex.sets + 1)}
                        style={styles.configBtn}
                      >
                        <Ionicons name="add" size={16} color={COLORS.text} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.configItem}>
                    <Text style={styles.configLabel}>Reps</Text>
                    <TextInput
                      style={styles.configInput}
                      value={ex.reps}
                      onChangeText={(v) => updateExercise(ex.exercise_id, 'reps', v)}
                      keyboardType="default"
                      placeholder="10"
                      placeholderTextColor={COLORS.textSecondary}
                    />
                  </View>
                  <View style={styles.configItem}>
                    <Text style={styles.configLabel}>kg</Text>
                    <TextInput
                      style={styles.configInput}
                      value={ex.weight ? String(ex.weight) : ''}
                      onChangeText={(v) => updateExercise(ex.exercise_id, 'weight', v ? parseFloat(v) || null : null)}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor={COLORS.textSecondary}
                    />
                  </View>
                </View>
              </View>
            ))}

            {/* Add Exercise Button */}
            <TouchableOpacity
              testID="add-exercise-btn"
              style={styles.addExerciseBtn}
              onPress={() => setShowExercisePicker(true)}
            >
              <Ionicons name="add-circle" size={22} color={COLORS.accent} />
              <Text style={styles.addExerciseBtnText}>Add Exercise</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  saveText: { fontSize: 16, fontWeight: '700', color: COLORS.accent },
  content: { padding: 20, paddingBottom: 40 },
  dateText: { fontSize: 14, fontWeight: '600', color: COLORS.accent, marginBottom: 8 },
  nameInput: {
    fontSize: 24, fontWeight: '800', color: COLORS.text,
    borderBottomWidth: 2, borderBottomColor: COLORS.border,
    paddingBottom: 12, marginBottom: 32,
  },
  exercisesSection: { },
  sectionTitle: {
    fontSize: 12, fontWeight: '800', color: COLORS.textSecondary,
    letterSpacing: 2, marginBottom: 16,
  },
  exerciseRow: {
    backgroundColor: COLORS.surface, borderRadius: 14, padding: 16, marginBottom: 12,
  },
  exerciseRowHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12,
  },
  exerciseRowName: { fontSize: 16, fontWeight: '700', color: COLORS.text, flex: 1, marginRight: 8 },
  exerciseRowConfig: { flexDirection: 'row', gap: 12 },
  configItem: { flex: 1, alignItems: 'center', gap: 6 },
  configLabel: { fontSize: 11, fontWeight: '600', color: COLORS.textSecondary, textTransform: 'uppercase' },
  configInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  configBtn: {
    width: 30, height: 30, borderRadius: 8, backgroundColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  configValue: { fontSize: 18, fontWeight: '700', color: COLORS.text, minWidth: 24, textAlign: 'center' },
  configInput: {
    fontSize: 18, fontWeight: '700', color: COLORS.text, textAlign: 'center',
    backgroundColor: COLORS.white, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: COLORS.border, minWidth: 60,
  },
  addExerciseBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 16, borderRadius: 14,
    borderWidth: 2, borderColor: COLORS.accent, borderStyle: 'dashed',
    marginTop: 4,
  },
  addExerciseBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.accent },
  // Picker styles
  pickerHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  pickerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  pickerSearch: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginVertical: 12,
    backgroundColor: COLORS.surface, borderRadius: 14, paddingHorizontal: 14, height: 48, gap: 10,
  },
  pickerSearchInput: { flex: 1, fontSize: 16, color: COLORS.text },
  pickerItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.surface,
  },
  pickerItemAdded: { opacity: 0.5 },
  pickerItemIcon: {
    width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
  pickerItemInfo: { flex: 1 },
  pickerItemName: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  pickerItemMeta: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2, textTransform: 'capitalize' },
});
