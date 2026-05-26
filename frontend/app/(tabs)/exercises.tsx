import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, ScrollView, ActivityIndicator, StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, BODY_PART_COLORS, BODY_PART_ICONS } from '@/src/constants/theme';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface Exercise {
  exercise_id: string;
  name: string;
  body_part: string;
  target: string;
  equipment: string;
  primary_muscles: string[];
  secondary_muscles: string[];
  category: string;
}

export default function ExercisesScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [bodyParts, setBodyParts] = useState<string[]>([]);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const fetchExercises = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedBodyPart) params.append('body_part', selectedBodyPart);
      if (searchQuery) params.append('search', searchQuery);
      const resp = await fetch(`${BACKEND_URL}/api/exercises?${params.toString()}`);
      const data = await resp.json();
      setExercises(data.exercises || []);
    } catch (e) {
      console.error('Fetch exercises error:', e);
    } finally {
      setLoading(false);
    }
  }, [selectedBodyPart, searchQuery]);

  const fetchBodyParts = useCallback(async () => {
    try {
      const resp = await fetch(`${BACKEND_URL}/api/exercises/body-parts`);
      const data = await resp.json();
      setBodyParts(data.body_parts || []);
    } catch (e) {
      console.error('Fetch body parts error:', e);
    }
  }, []);

  useEffect(() => {
    fetchBodyParts();
  }, []);

  useEffect(() => {
    const debounce = setTimeout(fetchExercises, 300);
    return () => clearTimeout(debounce);
  }, [selectedBodyPart, searchQuery]);

  const renderExerciseCard = ({ item }: { item: Exercise }) => {
    const color = BODY_PART_COLORS[item.body_part] || COLORS.accent;
    return (
      <TouchableOpacity
        testID={`exercise-card-${item.exercise_id}`}
        style={styles.exerciseCard}
        onPress={() => router.push(`/exercise/${item.exercise_id}`)}
        activeOpacity={0.7}
      >
        <View style={[styles.exerciseIconContainer, { backgroundColor: color + '15' }]}>
          <Ionicons
            name={(BODY_PART_ICONS[item.body_part] || 'barbell-outline') as any}
            size={28}
            color={color}
          />
        </View>
        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseName} numberOfLines={1}>{item.name}</Text>
          <View style={styles.exerciseMeta}>
            <View style={[styles.metaBadge, { backgroundColor: color + '15' }]}>
              <Text style={[styles.metaBadgeText, { color }]}>{item.body_part}</Text>
            </View>
            <View style={styles.metaBadge}>
              <Text style={styles.metaBadgeText}>{item.equipment}</Text>
            </View>
          </View>
          <Text style={styles.exerciseMuscles} numberOfLines={1}>
            {item.primary_muscles.join(', ')}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]} testID="exercises-screen">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>EXERCISES</Text>
        <Text style={styles.headerSubtitle}>{exercises.length} exercises available</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            testID="exercise-search-input"
            style={styles.searchInput}
            placeholder="Search exercises..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} testID="clear-search-btn">
              <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Body Part Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        <TouchableOpacity
          testID="filter-all"
          style={[styles.filterPill, !selectedBodyPart && styles.filterPillActive]}
          onPress={() => setSelectedBodyPart('')}
        >
          <Text style={[styles.filterText, !selectedBodyPart && styles.filterTextActive]}>All</Text>
        </TouchableOpacity>
        {bodyParts.map((bp) => {
          const isActive = selectedBodyPart === bp;
          const color = BODY_PART_COLORS[bp] || COLORS.accent;
          return (
            <TouchableOpacity
              key={bp}
              testID={`filter-${bp.replace(/\s+/g, '-')}`}
              style={[
                styles.filterPill,
                isActive && { backgroundColor: color, borderColor: color },
              ]}
              onPress={() => setSelectedBodyPart(isActive ? '' : bp)}
            >
              <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                {bp.charAt(0).toUpperCase() + bp.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Exercise List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.accent} />
        </View>
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={(item) => item.exercise_id}
          renderItem={renderExerciseCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color={COLORS.textSecondary} />
              <Text style={styles.emptyText}>No exercises found</Text>
              <Text style={styles.emptySubtext}>Try a different search or filter</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    marginRight: 8,
  },
  filterPillActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    textTransform: 'capitalize',
  },
  filterTextActive: {
    color: COLORS.white,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 100,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 14,
  },
  exerciseIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  exerciseMeta: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  metaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: COLORS.surface,
  },
  metaBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'capitalize',
  },
  exerciseMuscles: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    gap: 8,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
