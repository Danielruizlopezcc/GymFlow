import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList,
  ScrollView, StatusBar, ActivityIndicator, KeyboardAvoidingView,
  Platform, Alert, Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  COLORS, BODY_PART_COLORS, BODY_PART_ES, EQUIPMENT_ES,
} from '@/src/constants/theme';
import { filterExercises, BODY_PARTS, type Exercise } from '@/src/data/exercises';
import {
  createWorkout, updateWorkout, listWorkouts, type WorkoutExercise,
} from '@/src/lib/workouts';
import { getGifUrl } from '@/src/lib/supabase';

// Grupos musculares para el filtro del picker (null = todos)
const PICKER_TABS = [
  { key: null,          label: 'Todos' },
  ...BODY_PARTS.map(bp => ({ key: bp, label: BODY_PART_ES[bp] || bp })),
];

export default function CreateWorkoutScreen() {
  const { date, workoutId }                             = useLocalSearchParams<{ date: string; workoutId?: string }>();
  const isEditMode                                      = !!workoutId;

  const [workoutName, setWorkoutName]                   = useState('');
  const [selectedExercises, setSelectedExercises]       = useState<WorkoutExercise[]>([]);
  const [showPicker, setShowPicker]                     = useState(false);
  const [pickerSearch, setPickerSearch]                 = useState('');
  const [pickerBodyPart, setPickerBodyPart]             = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch]           = useState('');
  const [saving, setSaving]                             = useState(false);
  const [loadingWorkout, setLoadingWorkout]             = useState(isEditMode);
  const [errors, setErrors]                             = useState<{ name?: string; exercises?: string; save?: string }>({});

  const router  = useRouter();
  const insets  = useSafeAreaInsets();

  // Cargar workout existente si es modo edición
  useEffect(() => {
    if (!isEditMode) return;
    (async () => {
      try {
        const data = await listWorkouts({ date: date });
        const w = data.find(x => x.id === workoutId);
        if (w) {
          setWorkoutName(w.name);
          setSelectedExercises(w.exercises);
        }
      } catch (e) {
        console.error('[CreateWorkout] load:', e);
      } finally {
        setLoadingWorkout(false);
      }
    })();
  }, [workoutId]);

  // Debounce búsqueda
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(pickerSearch), 300);
    return () => clearTimeout(t);
  }, [pickerSearch]);

  // Ejercicios filtrados en el picker
  const pickerExercises = useCallback(
    () => filterExercises({ bodyPart: pickerBodyPart ?? undefined, search: debouncedSearch }),
    [pickerBodyPart, debouncedSearch],
  )();

  const addExercise = (exercise: Exercise) => {
    if (selectedExercises.find(e => e.exercise_id === exercise.exercise_id)) return;
    setSelectedExercises(prev => [
      ...prev,
      {
        exercise_id: exercise.exercise_id,
        name:        exercise.name,
        sets:        3,
        reps:        '10',
        weight:      null,
        notes:       '',
      },
    ]);
    setShowPicker(false);
    setPickerSearch('');
    setPickerBodyPart(null);
    setErrors(e => ({ ...e, exercises: undefined }));
  };

  const removeExercise = (id: string) =>
    setSelectedExercises(prev => prev.filter(e => e.exercise_id !== id));

  const updateField = (id: string, field: string, value: unknown) =>
    setSelectedExercises(prev =>
      prev.map(e => e.exercise_id === id ? { ...e, [field]: value } : e),
    );

  const handleSave = async () => {
    // Nombre automático si está vacío
    const finalName = workoutName.trim() ||
      new Date((date || new Date().toISOString().split('T')[0]) + 'T12:00:00')
        .toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' });

    // Validación inline — sin ejercicios no guardamos
    if (selectedExercises.length === 0) {
      setErrors(e => ({ ...e, exercises: 'Añade al menos un ejercicio antes de guardar' }));
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      if (isEditMode && workoutId) {
        await updateWorkout(workoutId, { name: finalName, exercises: selectedExercises });
      } else {
        await createWorkout({
          date:      date || new Date().toISOString().split('T')[0],
          name:      finalName,
          exercises: selectedExercises,
        });
      }
      router.back();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error desconocido';
      setErrors(prev => ({ ...prev, save: `No se pudo guardar: ${msg}` }));
      setSaving(false);
    }
  };

  const formattedDate = date
    ? new Date(date + 'T12:00:00').toLocaleDateString('es-ES', {
        weekday: 'long', month: 'long', day: 'numeric',
      })
    : 'Hoy';

  // ════════════════════════════════════════════════════════
  // PANTALLA DE CARGA (modo edición)
  // ════════════════════════════════════════════════════════
  if (loadingWorkout) {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  // ════════════════════════════════════════════════════════
  // PICKER DE EJERCICIOS
  // ════════════════════════════════════════════════════════
  if (showPicker) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]} testID="exercise-picker-screen">
        <StatusBar barStyle="dark-content" />

        {/* Cabecera picker */}
        <View style={styles.pickerHeader}>
          <TouchableOpacity
            testID="close-picker-btn"
            onPress={() => { setShowPicker(false); setPickerSearch(''); setPickerBodyPart(null); }}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.pickerTitle}>Añadir Ejercicio</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Buscador */}
        <View style={styles.pickerSearch}>
          <Ionicons name="search" size={18} color={COLORS.textSecondary} />
          <TextInput
            testID="picker-search-input"
            style={styles.pickerSearchInput}
            placeholder="Buscar ejercicio..."
            placeholderTextColor={COLORS.textSecondary}
            value={pickerSearch}
            onChangeText={setPickerSearch}
            autoFocus
          />
          {pickerSearch ? (
            <TouchableOpacity onPress={() => setPickerSearch('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filtro por grupo muscular — altura fija para no expandirse */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.pickerTabsScroll}
          contentContainerStyle={styles.pickerTabs}
          bounces={false}
        >
          {PICKER_TABS.map(tab => {
            const active = pickerBodyPart === tab.key;
            const color  = tab.key ? (BODY_PART_COLORS[tab.key] || COLORS.accent) : COLORS.accent;
            return (
              <TouchableOpacity
                key={String(tab.key)}
                style={[
                  styles.pickerTab,
                  { borderColor: color },
                  active && { backgroundColor: color },
                ]}
                onPress={() => setPickerBodyPart(active ? null : tab.key)}
                activeOpacity={0.75}
              >
                <Text style={[
                  styles.pickerTabText,
                  { color: active ? '#fff' : color },
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Lista de ejercicios — flex:1 para que ocupe el espacio restante */}
        <FlatList
          data={pickerExercises}
          keyExtractor={item => item.exercise_id}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
          renderItem={({ item }) => {
            const isAdded = selectedExercises.some(e => e.exercise_id === item.exercise_id);
            const color   = BODY_PART_COLORS[item.body_part] || COLORS.accent;
            return (
              <TouchableOpacity
                testID={`pick-exercise-${item.exercise_id}`}
                style={[styles.pickerItem, isAdded && styles.pickerItemAdded]}
                onPress={() => addExercise(item)}
                disabled={isAdded}
                activeOpacity={0.7}
              >
                <Image source={{ uri: getGifUrl(item.exercise_id) }} style={styles.pickerItemGif} />
                <View style={styles.pickerItemInfo}>
                  <Text style={styles.pickerItemName} numberOfLines={1}>{item.name}</Text>
                  <View style={styles.pickerItemMeta}>
                    <View style={[styles.pickerItemBadge, { backgroundColor: color + '18' }]}>
                      <Text style={[styles.pickerItemBadgeText, { color }]}>
                        {BODY_PART_ES[item.body_part] || item.body_part}
                      </Text>
                    </View>
                    <Text style={styles.pickerItemEquip}>
                      {EQUIPMENT_ES[item.equipment] || item.equipment}
                    </Text>
                  </View>
                </View>
                {isAdded
                  ? <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
                  : <Ionicons name="add-circle-outline" size={24} color={COLORS.accent} />
                }
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.pickerEmpty}>
              <Ionicons name="search-outline" size={36} color={COLORS.border} />
              <Text style={styles.pickerEmptyText}>Sin resultados</Text>
            </View>
          }
        />
      </View>
    );
  }

  // ════════════════════════════════════════════════════════
  // FORMULARIO DE ENTRENAMIENTO
  // ════════════════════════════════════════════════════════
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[styles.container, { paddingTop: insets.top }]} testID="create-workout-screen">
        <StatusBar barStyle="dark-content" />

        {/* Cabecera */}
        <View style={styles.header}>
          <TouchableOpacity testID="close-create-btn" onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditMode ? 'Editar Entrenamiento' : 'Nuevo Entrenamiento'}
          </Text>
          <TouchableOpacity testID="save-workout-btn" onPress={handleSave} disabled={saving}>
            {saving
              ? <ActivityIndicator size="small" color={COLORS.accent} />
              : <Text style={styles.saveText}>Guardar</Text>
            }
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {/* Fecha */}
          <View style={styles.dateBadge}>
            <Ionicons name="calendar-outline" size={14} color={COLORS.accent} />
            <Text style={styles.dateBadgeText}>{formattedDate}</Text>
          </View>

          {/* Nombre del entrenamiento */}
          <TextInput
            testID="workout-name-input"
            style={[styles.nameInput, errors.name ? { borderBottomColor: COLORS.danger } : null]}
            placeholder="Nombre (ej: Día de Pecho) — opcional"
            placeholderTextColor={COLORS.textSecondary}
            value={workoutName}
            onChangeText={v => { setWorkoutName(v); setErrors(e => ({ ...e, name: undefined })); }}
            returnKeyType="done"
          />

          {/* Sección ejercicios */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>EJERCICIOS ({selectedExercises.length})</Text>
            {errors.exercises ? (
              <View style={styles.errorBadge}>
                <Ionicons name="warning" size={13} color={COLORS.danger} />
                <Text style={styles.errorText}>{errors.exercises}</Text>
              </View>
            ) : null}
          </View>

          {/* Error de guardado */}
          {errors.save ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={16} color={COLORS.danger} />
              <Text style={styles.errorBannerText}>{errors.save}</Text>
            </View>
          ) : null}

          {selectedExercises.map((ex, idx) => (
            <View key={ex.exercise_id} style={styles.exCard} testID={`workout-exercise-${idx}`}>

              {/* Cabecera del ejercicio */}
              <View style={styles.exCardHeader}>
                <Image source={{ uri: getGifUrl(ex.exercise_id) }} style={styles.exCardGif} />
                <Text style={styles.exCardName} numberOfLines={2}>{ex.name}</Text>
                <TouchableOpacity
                  testID={`remove-exercise-${idx}`}
                  onPress={() => removeExercise(ex.exercise_id)}
                  style={styles.removeBtn}
                >
                  <Ionicons name="trash-outline" size={17} color={COLORS.danger} />
                </TouchableOpacity>
              </View>

              {/* Sets / Reps / Peso en fila */}
              <View style={styles.exStats}>

                {/* SETS */}
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>SERIES</Text>
                  <View style={styles.statStepper}>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => updateField(ex.exercise_id, 'sets', Math.max(1, ex.sets - 1))}
                    >
                      <Ionicons name="remove" size={15} color={COLORS.text} />
                    </TouchableOpacity>
                    <Text style={styles.stepValue}>{ex.sets}</Text>
                    <TouchableOpacity
                      style={styles.stepBtn}
                      onPress={() => updateField(ex.exercise_id, 'sets', ex.sets + 1)}
                    >
                      <Ionicons name="add" size={15} color={COLORS.text} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.statDivider} />

                {/* REPS */}
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>REPS</Text>
                  <TextInput
                    style={styles.statInput}
                    value={ex.reps}
                    onChangeText={v => updateField(ex.exercise_id, 'reps', v)}
                    placeholder="10"
                    placeholderTextColor={COLORS.textSecondary}
                    keyboardType="default"
                  />
                </View>

                <View style={styles.statDivider} />

                {/* PESO */}
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>KG</Text>
                  <TextInput
                    style={styles.statInput}
                    value={ex.weight ? String(ex.weight) : ''}
                    onChangeText={v => updateField(ex.exercise_id, 'weight', v ? parseFloat(v) || null : null)}
                    keyboardType="decimal-pad"
                    placeholder="—"
                    placeholderTextColor={COLORS.textSecondary}
                  />
                </View>

              </View>
            </View>
          ))}

          {/* Botón añadir ejercicio */}
          <TouchableOpacity
            testID="add-exercise-btn"
            style={styles.addExBtn}
            onPress={() => setShowPicker(true)}
          >
            <Ionicons name="add-circle" size={22} color={COLORS.accent} />
            <Text style={styles.addExBtnText}>Añadir Ejercicio</Text>
          </TouchableOpacity>

        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center:    { alignItems: 'center', justifyContent: 'center' },

  // ─── Cabecera ───────────────────────────────────────────
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  headerTitle: { fontSize: 17, fontWeight: '800', color: COLORS.text },
  saveText:    { fontSize: 16, fontWeight: '700', color: COLORS.accent },

  // ─── Contenido ──────────────────────────────────────────
  content: { padding: 20, paddingBottom: 48 },

  dateBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.accentLight, borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 5,
    alignSelf: 'flex-start', marginBottom: 16,
  },
  dateBadgeText: { fontSize: 13, fontWeight: '600', color: COLORS.accent, textTransform: 'capitalize' },

  nameInput: {
    fontSize: 22, fontWeight: '800', color: COLORS.text,
    borderBottomWidth: 2, borderBottomColor: COLORS.border,
    paddingBottom: 10, marginBottom: 28,
  },

  sectionHeader:  { marginBottom: 12, gap: 6 },
  sectionLabel: {
    fontSize: 11, fontWeight: '800', color: COLORS.textSecondary,
    letterSpacing: 1.8,
  },
  errorBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#FEF2F2', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6,
    borderWidth: 1, borderColor: '#FECACA',
  },
  errorText: { fontSize: 13, fontWeight: '600', color: COLORS.danger, flex: 1 },
  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FEF2F2', borderRadius: 10,
    padding: 12, marginBottom: 16,
    borderWidth: 1, borderColor: '#FECACA',
  },
  errorBannerText: { fontSize: 13, fontWeight: '600', color: COLORS.danger, flex: 1 },

  // ─── Tarjeta de ejercicio ──────────────────────────────
  exCard: {
    backgroundColor: COLORS.surface, borderRadius: 16,
    marginBottom: 10, overflow: 'hidden',
    borderWidth: 1, borderColor: COLORS.border,
  },
  exCardHeader: {
    flexDirection: 'row', alignItems: 'center',
    gap: 12, padding: 12,
  },
  exCardGif:  { width: 46, height: 46, borderRadius: 10, backgroundColor: COLORS.background },
  exCardName: { flex: 1, fontSize: 14, fontWeight: '700', color: COLORS.text, lineHeight: 20 },
  removeBtn:  { padding: 4 },

  // Stats (series/reps/kg)
  exStats: {
    flexDirection: 'row',
    borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  statItem: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingVertical: 10, gap: 6,
  },
  statDivider: { width: 1, backgroundColor: COLORS.border, marginVertical: 8 },
  statLabel:   { fontSize: 10, fontWeight: '800', color: COLORS.textSecondary, letterSpacing: 1.2 },
  statStepper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepBtn: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: COLORS.background,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  stepValue:  { fontSize: 17, fontWeight: '700', color: COLORS.text, minWidth: 22, textAlign: 'center' },
  statInput: {
    fontSize: 17, fontWeight: '700', color: COLORS.text,
    textAlign: 'center', minWidth: 44,
    backgroundColor: COLORS.background,
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4,
    borderWidth: 1, borderColor: COLORS.border,
  },

  // ─── Botón añadir ejercicio ────────────────────────────
  addExBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 16, borderRadius: 14,
    borderWidth: 2, borderColor: COLORS.accent, borderStyle: 'dashed',
    marginTop: 4,
  },
  addExBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.accent },

  // ─── Picker ────────────────────────────────────────────
  pickerHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  pickerTitle: { fontSize: 17, fontWeight: '800', color: COLORS.text },

  pickerSearch: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginTop: 12, marginBottom: 4,
    backgroundColor: COLORS.surface, borderRadius: 14,
    paddingHorizontal: 14, height: 48, gap: 10,
    borderWidth: 1, borderColor: COLORS.border,
  },
  pickerSearchInput: { flex: 1, fontSize: 16, color: COLORS.text },

  // Tabs de grupo muscular
  pickerTabsScroll: {
    flexGrow: 0,    // No expandirse verticalmente
    flexShrink: 0,
  },
  pickerTabs: {
    paddingHorizontal: 16, paddingVertical: 10, gap: 8,
    alignItems: 'center', flexDirection: 'row',
  },
  pickerTab: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 22, borderWidth: 2,
    backgroundColor: 'transparent',
  },
  pickerTabText: { fontSize: 14, fontWeight: '800' },

  // Lista de ejercicios del picker
  pickerItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.surface,
  },
  pickerItemAdded: { opacity: 0.45 },
  pickerItemGif:   { width: 50, height: 50, borderRadius: 12, backgroundColor: COLORS.surface },
  pickerItemInfo:  { flex: 1 },
  pickerItemName:  { fontSize: 14, fontWeight: '700', color: COLORS.text },
  pickerItemMeta:  { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  pickerItemBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  pickerItemBadgeText: { fontSize: 11, fontWeight: '700' },
  pickerItemEquip: { fontSize: 12, color: COLORS.textSecondary, textTransform: 'capitalize' },

  pickerEmpty: { alignItems: 'center', paddingTop: 48, gap: 10 },
  pickerEmptyText: { fontSize: 15, fontWeight: '600', color: COLORS.textSecondary },
});
