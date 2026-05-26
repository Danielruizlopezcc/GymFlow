import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  ActivityIndicator, StatusBar, Alert, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/src/constants/theme';
import { listWorkouts, deleteWorkout, type Workout } from '@/src/lib/workouts';
import { getGifUrl } from '@/src/lib/supabase';

const DAYS   = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function getMonthStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export default function CalendarScreen() {
  const [currentDate, setCurrentDate]   = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [workouts, setWorkouts]         = useState<Workout[]>([]);
  const [workoutDates, setWorkoutDates] = useState<Set<string>>(new Set());
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const router  = useRouter();
  const insets  = useSafeAreaInsets();

  const fetchWorkouts = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const data = await listWorkouts({ month: getMonthStr(currentDate) });
      setWorkouts(data);
      setWorkoutDates(new Set(data.map(w => w.date)));
    } catch (e) {
      console.error('[Calendar] fetchWorkouts:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentDate]);

  useEffect(() => { fetchWorkouts(); }, [currentDate]);

  const handleDelete = (workoutId: string) => {
    deleteWorkout(workoutId)
      .then(() => { setConfirmDeleteId(null); fetchWorkouts(true); })
      .catch((e) => console.error('[Calendar] delete error:', e));
  };

  const navigateMonth = (dir: number) => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + dir);
    setCurrentDate(d);
  };

  // ── Datos del calendario ──────────────────────────────────
  const year        = currentDate.getFullYear();
  const month       = currentDate.getMonth();
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const selectedWorkouts = workouts.filter(w => w.date === selectedDate);
  const today            = formatDate(new Date());

  const selectedLabel = selectedDate === today
    ? 'Hoy'
    : new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-ES', {
        weekday: 'long', month: 'long', day: 'numeric',
      });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]} testID="calendar-screen">
      <StatusBar barStyle="dark-content" />

      {/* Cabecera */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>PLANIFICADOR</Text>
          <Text style={styles.headerSub}>{MONTHS[month]} {year}</Text>
        </View>
        <TouchableOpacity
          testID="create-workout-btn"
          style={styles.addBtn}
          onPress={() => router.push({ pathname: '/workout/create', params: { date: selectedDate } })}
        >
          <Ionicons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Navegación de mes */}
        <View style={styles.monthNav}>
          <TouchableOpacity onPress={() => navigateMonth(-1)} testID="prev-month-btn" style={styles.navBtn}>
            <Ionicons name="chevron-back" size={20} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.monthText}>{MONTHS[month]} {year}</Text>
          <TouchableOpacity onPress={() => navigateMonth(1)} testID="next-month-btn" style={styles.navBtn}>
            <Ionicons name="chevron-forward" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Cabeceras de día */}
        <View style={styles.dayHeaders}>
          {DAYS.map(d => (
            <Text key={d} style={styles.dayHeaderText}>{d}</Text>
          ))}
        </View>

        {/* Grid del calendario */}
        <View style={styles.calendarGrid}>
          {calendarDays.map((day, idx) => {
            if (day === null) return <View key={`empty-${idx}`} style={styles.calendarCell} />;
            const dateStr    = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isSelected = dateStr === selectedDate;
            const isToday    = dateStr === today;
            const hasWorkout = workoutDates.has(dateStr);
            return (
              <TouchableOpacity
                key={dateStr}
                testID={`calendar-day-${day}`}
                style={[
                  styles.calendarCell,
                  isSelected && styles.calendarCellSelected,
                  isToday && !isSelected && styles.calendarCellToday,
                ]}
                onPress={() => setSelectedDate(dateStr)}
              >
                <Text style={[
                  styles.calendarDayText,
                  isSelected && styles.calendarDayTextSelected,
                  isToday && !isSelected && styles.calendarDayTextToday,
                ]}>
                  {day}
                </Text>
                {hasWorkout && (
                  <View style={[styles.workoutDot, isSelected && styles.workoutDotSelected]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Sección del día seleccionado */}
        <View style={styles.daySection}>
          {/* Título del día + botón añadir inline */}
          <View style={styles.daySectionHeader}>
            <Text style={styles.daySectionTitle} numberOfLines={1}>{selectedLabel}</Text>
            <TouchableOpacity
              style={styles.inlineAddBtn}
              onPress={() => router.push({ pathname: '/workout/create', params: { date: selectedDate } })}
            >
              <Ionicons name="add" size={16} color={COLORS.accent} />
              <Text style={styles.inlineAddText}>Nuevo</Text>
            </TouchableOpacity>
          </View>

          {/* Loading */}
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.accent} style={{ marginTop: 24 }} />
          ) : selectedWorkouts.length > 0 ? (

            /* Tarjetas de entrenamiento */
            selectedWorkouts.map(w => (
              <View key={w.id} style={styles.workoutCard} testID={`workout-card-${w.id}`}>

                {/* Nombre */}
                <View style={styles.workoutCardHeader}>
                  <View style={[styles.colorDot, { backgroundColor: COLORS.accent }]} />
                  <Text style={styles.workoutName} numberOfLines={1}>{w.name}</Text>
                  <Text style={styles.workoutExCount}>{w.exercises.length} ejerc.</Text>
                </View>

                {/* Ejercicios */}
                {w.exercises.length === 0 ? (
                  <Text style={styles.noExText}>Sin ejercicios aún</Text>
                ) : (
                  w.exercises.map((ex, i) => (
                    <View key={i} style={styles.exRow}>
                      <Image source={{ uri: getGifUrl(ex.exercise_id) }} style={styles.exGif} />
                      <Text style={styles.exName} numberOfLines={1}>{ex.name}</Text>
                      <Text style={styles.exSets}>{ex.sets}×{ex.reps}</Text>
                      {ex.weight ? <Text style={styles.exWeight}>{ex.weight} kg</Text> : null}
                    </View>
                  ))
                )}

                {/* Acciones */}
                {confirmDeleteId === w.id ? (
                  /* Confirmación inline */
                  <View style={styles.confirmBox}>
                    <Text style={styles.confirmText}>¿Eliminar este entrenamiento?</Text>
                    <View style={styles.confirmButtons}>
                      <TouchableOpacity
                        style={styles.confirmCancel}
                        activeOpacity={0.7}
                        onPress={() => setConfirmDeleteId(null)}
                      >
                        <Text style={styles.confirmCancelText}>Cancelar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.confirmDelete}
                        activeOpacity={0.7}
                        onPress={() => handleDelete(w.id)}
                      >
                        <Ionicons name="trash-outline" size={15} color="#fff" />
                        <Text style={styles.confirmDeleteText}>Sí, eliminar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  /* Botones normales */
                  <View style={styles.workoutActions}>
                    <TouchableOpacity
                      testID={`edit-workout-${w.id}`}
                      style={styles.actionBtn}
                      activeOpacity={0.6}
                      onPress={() => router.push({
                        pathname: '/workout/create',
                        params: { date: w.date, workoutId: w.id },
                      })}
                    >
                      <Ionicons name="create-outline" size={16} color={COLORS.accent} />
                      <Text style={[styles.actionBtnText, { color: COLORS.accent }]}>Editar</Text>
                    </TouchableOpacity>

                    <View style={styles.actionDivider} />

                    <TouchableOpacity
                      testID={`delete-workout-${w.id}`}
                      style={styles.actionBtn}
                      activeOpacity={0.6}
                      onPress={() => setConfirmDeleteId(w.id)}
                    >
                      <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
                      <Text style={[styles.actionBtnText, { color: COLORS.danger }]}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>
                )}

              </View>
            ))

          ) : (
            /* Estado vacío */
            <View style={styles.emptyDay}>
              <Ionicons name="calendar-outline" size={44} color={COLORS.border} />
              <Text style={styles.emptyDayTitle}>Sin entrenamientos</Text>
              <Text style={styles.emptyDayDesc}>Toca "Nuevo" para planificar este día</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: COLORS.surface },

  // ─── Cabecera ──────────────────────────────────────────
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  headerTitle: { fontSize: 24, fontWeight: '900', color: COLORS.text, letterSpacing: 2 },
  headerSub:   { fontSize: 13, color: COLORS.textSecondary, marginTop: 1 },
  addBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center',
  },

  // ─── Mes ───────────────────────────────────────────────
  monthNav: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14,
    backgroundColor: COLORS.background,
  },
  navBtn:    { padding: 4 },
  monthText: { fontSize: 16, fontWeight: '700', color: COLORS.text },

  // ─── Grid ─────────────────────────────────────────────
  dayHeaders: {
    flexDirection: 'row', paddingHorizontal: 12,
    backgroundColor: COLORS.background, paddingBottom: 8,
  },
  dayHeaderText: {
    flex: 1, textAlign: 'center',
    fontSize: 11, fontWeight: '600',
    color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8,
  },
  calendarGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: 12, paddingBottom: 16,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  calendarCell:           { width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  calendarCellSelected:   { backgroundColor: COLORS.accent, borderRadius: 12 },
  calendarCellToday:      { borderWidth: 2, borderColor: COLORS.accent, borderRadius: 12 },
  calendarDayText:        { fontSize: 14, fontWeight: '500', color: COLORS.text },
  calendarDayTextSelected:{ color: COLORS.white, fontWeight: '700' },
  calendarDayTextToday:   { color: COLORS.accent, fontWeight: '700' },
  workoutDot:             { width: 5, height: 5, borderRadius: 3, backgroundColor: COLORS.accent, position: 'absolute', bottom: 5 },
  workoutDotSelected:     { backgroundColor: COLORS.white },

  // ─── Sección del día ───────────────────────────────────
  daySection: { padding: 16 },

  daySectionHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 14,
  },
  daySectionTitle: {
    fontSize: 18, fontWeight: '800', color: COLORS.text,
    flex: 1, textTransform: 'capitalize',
  },
  inlineAddBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1.5, borderColor: COLORS.accent,
  },
  inlineAddText: { fontSize: 13, fontWeight: '700', color: COLORS.accent },

  // ─── Tarjeta de entrenamiento ──────────────────────────
  workoutCard: {
    backgroundColor: COLORS.cardBg, borderRadius: 16, padding: 14,
    marginBottom: 12, borderWidth: 1, borderColor: COLORS.border,
  },
  workoutCardHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10,
  },
  colorDot:     { width: 10, height: 10, borderRadius: 5 },
  workoutName:  { fontSize: 16, fontWeight: '700', color: COLORS.text, flex: 1 },
  workoutExCount:{ fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  iconBtn: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center',
  },

  // ─── Fila de ejercicio dentro de tarjeta ──────────────
  exRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 8,
    borderTopWidth: 1, borderTopColor: COLORS.surface,
  },
  exGif:    { width: 38, height: 38, borderRadius: 9, backgroundColor: COLORS.surface },
  exName:   { fontSize: 13, color: COLORS.text, flex: 1, fontWeight: '500' },
  exSets:   { fontSize: 13, fontWeight: '700', color: COLORS.accent },
  exWeight: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },

  noExText: { fontSize: 13, color: COLORS.textSecondary, fontStyle: 'italic', paddingTop: 4 },

  // ─── Acciones de la tarjeta ────────────────────────────
  // ─── Botones de acción normales ───────────────────────
  workoutActions: {
    flexDirection: 'row',
    borderTopWidth: 1, borderTopColor: COLORS.border,
    marginTop: 10,
  },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 12,
  },
  actionBtnText:  { fontSize: 14, fontWeight: '700' },
  actionDivider:  { width: 1, backgroundColor: COLORS.border, marginVertical: 8 },

  // ─── Confirmación de borrado ───────────────────────────
  confirmBox: {
    borderTopWidth: 1, borderTopColor: COLORS.border,
    marginTop: 10, paddingTop: 12, gap: 10,
  },
  confirmText: {
    fontSize: 14, fontWeight: '600', color: COLORS.text,
    textAlign: 'center',
  },
  confirmButtons: {
    flexDirection: 'row', gap: 10,
  },
  confirmCancel: {
    flex: 1, paddingVertical: 11, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
  },
  confirmCancelText: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  confirmDelete: {
    flex: 1, paddingVertical: 11, borderRadius: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, backgroundColor: COLORS.danger,
  },
  confirmDeleteText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  // ─── Vacío ─────────────────────────────────────────────
  emptyDay:      { alignItems: 'center', paddingTop: 44, paddingBottom: 24, gap: 8 },
  emptyDayTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textSecondary },
  emptyDayDesc:  { fontSize: 13, color: COLORS.tabInactive, textAlign: 'center' },
});
