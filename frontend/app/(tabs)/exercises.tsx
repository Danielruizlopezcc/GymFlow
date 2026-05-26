import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, StatusBar, Image, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  COLORS, BODY_PART_COLORS, BODY_PART_ES, EQUIPMENT_ES,
} from '@/src/constants/theme';
import { filterExercises, BODY_PARTS, EXERCISES, type Exercise } from '@/src/data/exercises';
import { getGifUrl } from '@/src/lib/supabase';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = (SCREEN_W - 20 * 2 - 12) / 2;

// Icono por grupo muscular
const GROUP_ICONS: Record<string, string> = {
  'chest':      'fitness',
  'back':       'body',
  'shoulders':  'accessibility',
  'upper arms': 'barbell',
  'lower arms': 'hand-right',
  'upper legs': 'walk',
  'lower legs': 'footsteps',
  'waist':      'radio-button-on',
};

// Grupos musculares ordenados por nº de ejercicios (mayor primero)
const MUSCLE_GROUPS = BODY_PARTS
  .map(bp => ({
    key:   bp,
    label: BODY_PART_ES[bp] || bp,
    color: BODY_PART_COLORS[bp] || COLORS.accent,
    icon:  GROUP_ICONS[bp] || 'fitness',
    count: EXERCISES.filter(e => e.body_part === bp).length,
  }))
  .sort((a, b) => b.count - a.count);

export default function ExercisesScreen() {
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
  const [searchQuery, setSearchQuery]           = useState('');
  const router  = useRouter();
  const insets  = useSafeAreaInsets();

  const exercises = useMemo(
    () => selectedBodyPart
      ? filterExercises({ bodyPart: selectedBodyPart, search: searchQuery })
      : [],
    [selectedBodyPart, searchQuery],
  );

  const selectedGroup = selectedBodyPart
    ? MUSCLE_GROUPS.find(g => g.key === selectedBodyPart)
    : null;

  const goBack = () => {
    setSelectedBodyPart(null);
    setSearchQuery('');
  };

  // ── Tarjeta de ejercicio individual ──────────────────────────
  const renderExerciseCard = ({ item }: { item: Exercise }) => {
    const color = BODY_PART_COLORS[item.body_part] || COLORS.accent;
    return (
      <TouchableOpacity
        testID={`exercise-card-${item.exercise_id}`}
        style={styles.exerciseCard}
        onPress={() => router.push(`/exercise/${item.exercise_id}`)}
        activeOpacity={0.72}
      >
        <Image source={{ uri: getGifUrl(item.exercise_id) }} style={styles.exerciseGif} />
        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseName} numberOfLines={2}>{item.name}</Text>
          <View style={styles.exerciseMeta}>
            <View style={[styles.metaBadge, { backgroundColor: color + '18' }]}>
              <Text style={[styles.metaBadgeText, { color }]}>
                {EQUIPMENT_ES[item.equipment] || item.equipment}
              </Text>
            </View>
          </View>
          <Text style={styles.exerciseMuscle} numberOfLines={1}>
            {item.primary_muscles[0]}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={17} color={COLORS.border} />
      </TouchableOpacity>
    );
  };

  // ════════════════════════════════════════════════════════════
  // VISTA A — Cuadrícula de grupos musculares
  // ════════════════════════════════════════════════════════════
  if (!selectedBodyPart) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]} testID="exercises-screen">
        <StatusBar barStyle="dark-content" />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>EJERCICIOS</Text>
          <Text style={styles.headerSub}>¿Qué vas a trabajar hoy?</Text>
        </View>

        <FlatList
          data={MUSCLE_GROUPS}
          keyExtractor={item => item.key}
          numColumns={2}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={{ gap: 12 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              testID={`muscle-group-${item.key}`}
              style={[styles.groupCard, { width: CARD_W, backgroundColor: item.color }]}
              onPress={() => setSelectedBodyPart(item.key)}
              activeOpacity={0.82}
            >
              {/* Icono grande de fondo (decorativo) */}
              <Ionicons
                name={item.icon as any}
                size={64}
                color="rgba(255,255,255,0.15)"
                style={styles.groupCardBgIcon}
              />
              {/* Contenido */}
              <View style={styles.groupCardContent}>
                <Ionicons name={item.icon as any} size={26} color="#fff" />
                <Text style={styles.groupCardLabel}>{item.label}</Text>
                <Text style={styles.groupCardCount}>{item.count} ejercicios</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  // ════════════════════════════════════════════════════════════
  // VISTA B — Lista de ejercicios del grupo
  // ════════════════════════════════════════════════════════════
  const groupColor = selectedGroup?.color || COLORS.accent;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]} testID="exercises-list-screen">
      <StatusBar barStyle="light-content" />

      {/* Cabecera coloreada */}
      <View style={[styles.listHeader, { backgroundColor: groupColor }]}>
        <TouchableOpacity
          testID="back-to-groups-btn"
          onPress={goBack}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.listHeaderTitle}>{selectedGroup?.label.toUpperCase()}</Text>
          <Text style={styles.listHeaderSub}>{exercises.length} ejercicios</Text>
        </View>
        <Ionicons name={selectedGroup?.icon as any} size={28} color="rgba(255,255,255,0.35)" />
      </View>

      {/* Buscador */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={17} color={COLORS.textSecondary} />
        <TextInput
          testID="exercise-search-input"
          style={styles.searchInput}
          placeholder="Buscar ejercicio o músculo..."
          placeholderTextColor={COLORS.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')} testID="clear-search-btn">
            <Ionicons name="close-circle" size={17} color={COLORS.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Lista */}
      <FlatList
        data={exercises}
        keyExtractor={item => item.exercise_id}
        renderItem={renderExerciseCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={42} color={COLORS.border} />
            <Text style={styles.emptyText}>Sin resultados</Text>
          </View>
        }
      />
    </View>
  );
}

// ── Estilos ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },

  // ─── Cabecera pantalla principal ──────────────────────────
  header: {
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 14,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  headerTitle: { fontSize: 28, fontWeight: '900', color: COLORS.text, letterSpacing: 2 },
  headerSub:   { fontSize: 14, color: COLORS.textSecondary, marginTop: 2 },

  // ─── Grid de cuadros de grupo muscular ───────────────────
  gridContent: { padding: 20, paddingBottom: 110, gap: 12 },

  groupCard: {
    height:        130,
    borderRadius:  16,
    overflow:      'hidden',
    justifyContent:'flex-end',
    elevation:     3,
    shadowColor:   '#000',
    shadowOpacity: 0.14,
    shadowOffset:  { width: 0, height: 2 },
    shadowRadius:  8,
  },
  groupCardBgIcon: {
    position: 'absolute',
    right: -6,
    top:   10,
  },
  groupCardContent: {
    padding: 14,
    gap:     4,
  },
  groupCardLabel: {
    fontSize:    17,
    fontWeight:  '800',
    color:       '#fff',
    letterSpacing: 0.4,
    marginTop:   4,
  },
  groupCardCount: {
    fontSize:  12,
    fontWeight:'500',
    color:     'rgba(255,255,255,0.78)',
  },

  // ─── Cabecera de lista de grupo ───────────────────────────
  listHeader: {
    flexDirection:  'row',
    alignItems:     'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
    gap: 14,
  },
  backBtn: {
    width: 36, height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  listHeaderTitle: {
    fontSize: 20, fontWeight: '900', color: '#fff', letterSpacing: 1.2,
  },
  listHeaderSub: {
    fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: '500', marginTop: 1,
  },

  // ─── Buscador ─────────────────────────────────────────────
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 10,
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.text },

  // ─── Tarjeta de ejercicio ─────────────────────────────────
  listContent: { paddingHorizontal: 16, paddingBottom: 110 },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    padding: 11,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  exerciseGif:    { width: 62, height: 62, borderRadius: 11, backgroundColor: COLORS.surface },
  exerciseInfo:   { flex: 1 },
  exerciseName:   { fontSize: 15, fontWeight: '700', color: COLORS.text, lineHeight: 20 },
  exerciseMeta:   { flexDirection: 'row', marginTop: 5 },
  metaBadge:      { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  metaBadgeText:  { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  exerciseMuscle: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4, textTransform: 'capitalize' },

  // ─── Estado vacío ─────────────────────────────────────────
  empty:     { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyText: { fontSize: 16, fontWeight: '600', color: COLORS.textSecondary },
});
