import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  ActivityIndicator, StatusBar, Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { storage } from '@/src/utils/storage';
import { COLORS } from '@/src/constants/theme';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface Workout {
  workout_id: string;
  date: string;
  name: string;
  exercises: { exercise_id: string; name: string; sets: number; reps: string; }[];
}

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [workoutDates, setWorkoutDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  function formatDate(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function getMonthStr(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  const fetchWorkouts = useCallback(async () => {
    setLoading(true);
    try {
      const token = await storage.secureGet('session_token', '');
      const month = getMonthStr(currentDate);
      const resp = await fetch(`${BACKEND_URL}/api/workouts?month=${month}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (resp.ok) {
        const data = await resp.json();
        setWorkouts(data.workouts || []);
        const dates = new Set<string>((data.workouts || []).map((w: Workout) => w.date));
        setWorkoutDates(dates);
      }
    } catch (e) {
      console.error('Fetch workouts error:', e);
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  useEffect(() => {
    fetchWorkouts();
  }, [currentDate]);

  const deleteWorkout = async (workoutId: string) => {
    try {
      const token = await storage.secureGet('session_token', '');
      await fetch(`${BACKEND_URL}/api/workouts/${workoutId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      fetchWorkouts();
    } catch (e) {
      console.error('Delete workout error:', e);
    }
  };

  const confirmDelete = (workoutId: string) => {
    Alert.alert('Delete Workout', 'Are you sure you want to delete this workout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteWorkout(workoutId) },
    ]);
  };

  const navigateMonth = (dir: number) => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + dir);
    setCurrentDate(d);
  };

  // Calendar Grid
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const selectedWorkouts = workouts.filter((w) => w.date === selectedDate);
  const today = formatDate(new Date());

  return (
    <View style={[styles.container, { paddingTop: insets.top }]} testID="calendar-screen">
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>PLANNER</Text>
        <TouchableOpacity
          testID="create-workout-btn"
          style={styles.addBtn}
          onPress={() => router.push({ pathname: '/workout/create', params: { date: selectedDate } })}
        >
          <Ionicons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Month Navigation */}
        <View style={styles.monthNav}>
          <TouchableOpacity onPress={() => navigateMonth(-1)} testID="prev-month-btn">
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.monthText}>{MONTHS[month]} {year}</Text>
          <TouchableOpacity onPress={() => navigateMonth(1)} testID="next-month-btn">
            <Ionicons name="chevron-forward" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Day Headers */}
        <View style={styles.dayHeaders}>
          {DAYS.map((d) => (
            <Text key={d} style={styles.dayHeaderText}>{d}</Text>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarGrid}>
          {calendarDays.map((day, idx) => {
            if (day === null) return <View key={`empty-${idx}`} style={styles.calendarCell} />;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isSelected = dateStr === selectedDate;
            const isToday = dateStr === today;
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
                  <View style={[
                    styles.workoutDot,
                    isSelected && styles.workoutDotSelected,
                  ]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Selected Day Workouts */}
        <View style={styles.selectedDaySection}>
          <View style={styles.selectedDayHeader}>
            <Text style={styles.selectedDayTitle}>
              {selectedDate === today ? 'Today' : new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </Text>
          </View>

          {loading ? (
            <ActivityIndicator size="small" color={COLORS.accent} style={{ marginTop: 20 }} />
          ) : selectedWorkouts.length > 0 ? (
            selectedWorkouts.map((w) => (
              <View key={w.workout_id} style={styles.workoutCard} testID={`workout-card-${w.workout_id}`}>
                <View style={styles.workoutCardHeader}>
                  <View style={styles.workoutNameRow}>
                    <View style={[styles.workoutDotLarge, { backgroundColor: COLORS.accent }]} />
                    <Text style={styles.workoutName}>{w.name}</Text>
                  </View>
                  <TouchableOpacity
                    testID={`delete-workout-${w.workout_id}`}
                    onPress={() => confirmDelete(w.workout_id)}
                  >
                    <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
                  </TouchableOpacity>
                </View>
                {w.exercises.map((ex, i) => (
                  <View key={i} style={styles.workoutExerciseRow}>
                    <Text style={styles.workoutExerciseName}>{ex.name}</Text>
                    <Text style={styles.workoutExerciseSets}>{ex.sets}x{ex.reps}</Text>
                  </View>
                ))}
                {w.exercises.length === 0 && (
                  <Text style={styles.noExercisesText}>No exercises added yet</Text>
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyDay}>
              <Ionicons name="calendar-outline" size={40} color={COLORS.border} />
              <Text style={styles.emptyDayText}>No workouts planned</Text>
              <TouchableOpacity
                testID="add-workout-empty-btn"
                style={styles.addWorkoutBtn}
                onPress={() => router.push({ pathname: '/workout/create', params: { date: selectedDate } })}
              >
                <Ionicons name="add" size={18} color={COLORS.white} />
                <Text style={styles.addWorkoutBtnText}>Add Workout</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, backgroundColor: COLORS.background,
  },
  headerTitle: { fontSize: 28, fontWeight: '900', color: COLORS.text, letterSpacing: 2 },
  addBtn: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  monthNav: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16, backgroundColor: COLORS.background,
  },
  monthText: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  dayHeaders: {
    flexDirection: 'row', paddingHorizontal: 12,
    backgroundColor: COLORS.background, paddingBottom: 8,
  },
  dayHeaderText: {
    flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '600',
    color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 1,
  },
  calendarGrid: {
    flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, paddingBottom: 16,
    backgroundColor: COLORS.background, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  calendarCell: {
    width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  calendarCellSelected: {
    backgroundColor: COLORS.accent, borderRadius: 14,
  },
  calendarCellToday: {
    borderWidth: 2, borderColor: COLORS.accent, borderRadius: 14,
  },
  calendarDayText: { fontSize: 15, fontWeight: '500', color: COLORS.text },
  calendarDayTextSelected: { color: COLORS.white, fontWeight: '700' },
  calendarDayTextToday: { color: COLORS.accent, fontWeight: '700' },
  workoutDot: {
    width: 5, height: 5, borderRadius: 3, backgroundColor: COLORS.accent,
    position: 'absolute', bottom: 6,
  },
  workoutDotSelected: { backgroundColor: COLORS.white },
  selectedDaySection: { padding: 20 },
  selectedDayHeader: { marginBottom: 16 },
  selectedDayTitle: { fontSize: 20, fontWeight: '800', color: COLORS.text },
  workoutCard: {
    backgroundColor: COLORS.cardBg, borderRadius: 16, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: COLORS.border,
  },
  workoutCardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12,
  },
  workoutNameRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  workoutDotLarge: { width: 10, height: 10, borderRadius: 5 },
  workoutName: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  workoutExerciseRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 6, borderTopWidth: 1, borderTopColor: COLORS.surface,
  },
  workoutExerciseName: { fontSize: 14, color: COLORS.text, flex: 1 },
  workoutExerciseSets: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  noExercisesText: { fontSize: 14, color: COLORS.textSecondary, fontStyle: 'italic' },
  emptyDay: { alignItems: 'center', paddingTop: 40, gap: 12 },
  emptyDayText: { fontSize: 16, color: COLORS.textSecondary },
  addWorkoutBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.accent, paddingHorizontal: 20, paddingVertical: 12,
    borderRadius: 24, marginTop: 8,
  },
  addWorkoutBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.white },
});
