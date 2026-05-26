import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, StatusBar, Image
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, BODY_PART_COLORS, BODY_PART_ICONS, EQUIPMENT_ICONS, BODY_PART_ES, EQUIPMENT_ES } from '@/src/constants/theme';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface Exercise {
  exercise_id: string;
  name: string;
  body_part: string;
  target: string;
  equipment: string;
  primary_muscles: string[];
  secondary_muscles: string[];
  instructions: string[];
  category: string;
}

type TabType = 'about' | 'instructions' | 'similar';

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [similar, setSimilar] = useState<Exercise[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('about');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchExercise();
  }, [id]);

  const fetchExercise = async () => {
    setLoading(true);
    try {
      const [exResp, simResp] = await Promise.all([
        fetch(`${BACKEND_URL}/api/exercises/${id}`),
        fetch(`${BACKEND_URL}/api/exercises/${id}/similar`),
      ]);
      if (exResp.ok) {
        const exData = await exResp.json();
        setExercise(exData);
      }
      if (simResp.ok) {
        const simData = await simResp.json();
        setSimilar(simData.similar || []);
      }
    } catch (e) {
      console.error('Fetch exercise error:', e);
    } finally {
      setLoading(false);
    }
  };

  const navigateToExercise = (exerciseId: string) => {
    router.push(`/exercise/${exerciseId}`);
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  if (!exercise) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>Ejercicio no encontrado</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtnAlt}>
          <Text style={styles.backBtnAltText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const bodyColor = BODY_PART_COLORS[exercise.body_part] || COLORS.accent;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]} testID="exercise-detail-screen">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity testID="back-btn" onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{exercise.name}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Hero Section - GIF */}
      <View style={[styles.heroSection, { backgroundColor: bodyColor + '10' }]}>
        <Image
          source={{ uri: `${BACKEND_URL}/api/exercises/${exercise.exercise_id}/gif` }}
          style={styles.heroGif}
          resizeMode="contain"
        />
        <View style={styles.heroMeta}>
          <View style={[styles.heroBadge, { backgroundColor: bodyColor + '20' }]}>
            <Text style={[styles.heroBadgeText, { color: bodyColor }]}>
              {BODY_PART_ES[exercise.body_part] || exercise.body_part}
            </Text>
          </View>
          <View style={styles.heroBadge}>
            <Ionicons name={(EQUIPMENT_ICONS[exercise.equipment] || 'ellipsis-horizontal-outline') as any} size={14} color={COLORS.textSecondary} />
            <Text style={styles.heroBadgeText}>{EQUIPMENT_ES[exercise.equipment] || exercise.equipment}</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {(['about', 'instructions', 'similar'] as TabType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            testID={`tab-${tab}`}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'about' ? 'Info' : tab === 'instructions' ? 'Instrucciones' : `Alternativas (${similar.length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {activeTab === 'about' && (
          <View>
            {/* Muscle Info */}
            <View style={styles.muscleCard}>
              <View style={styles.muscleSection}>
                <View style={styles.muscleLabelRow}>
                  <View style={[styles.muscleDot, { backgroundColor: '#EF4444' }]} />
                  <Text style={styles.muscleLabel}>PRIMARIO</Text>
                </View>
                {exercise.primary_muscles.map((m, i) => (
                  <Text key={i} style={styles.muscleName}>{m}</Text>
                ))}
              </View>
              {exercise.secondary_muscles.length > 0 && (
                <View style={[styles.muscleSection, styles.muscleSectionBorder]}>
                  <View style={styles.muscleLabelRow}>
                    <View style={[styles.muscleDot, { backgroundColor: '#3B82F6' }]} />
                    <Text style={styles.muscleLabel}>SECUNDARIO</Text>
                  </View>
                  {exercise.secondary_muscles.map((m, i) => (
                    <Text key={i} style={styles.muscleName}>{m}</Text>
                  ))}
                </View>
              )}
            </View>

            {/* Quick Info */}
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ionicons name="body-outline" size={24} color={COLORS.accent} />
                <Text style={styles.infoLabel}>Grupo</Text>
                <Text style={styles.infoValue}>{BODY_PART_ES[exercise.body_part] || exercise.body_part}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="locate-outline" size={24} color={COLORS.accent} />
                <Text style={styles.infoLabel}>Músculo</Text>
                <Text style={styles.infoValue}>{exercise.target}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name={(EQUIPMENT_ICONS[exercise.equipment] || 'barbell-outline') as any} size={24} color={COLORS.accent} />
                <Text style={styles.infoLabel}>Equipo</Text>
                <Text style={styles.infoValue}>{EQUIPMENT_ES[exercise.equipment] || exercise.equipment}</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'instructions' && (
          <View style={styles.instructionsContainer}>
            {exercise.instructions.map((step, idx) => (
              <View key={idx} style={styles.instructionStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{idx + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{step}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'similar' && (
          <View>
            <Text style={styles.similarTitle}>Ejercicios alternativos</Text>
            <Text style={styles.similarSubtitle}>
              ¿Máquina ocupada? Prueba estas alternativas que trabajan los mismos músculos
            </Text>
            {similar.length > 0 ? (
              similar.map((item) => {
                const simColor = BODY_PART_COLORS[item.body_part] || COLORS.accent;
                return (
                  <TouchableOpacity
                    key={item.exercise_id}
                    testID={`similar-${item.exercise_id}`}
                    style={styles.similarCard}
                    onPress={() => navigateToExercise(item.exercise_id)}
                  >
                    <Image
                      source={{ uri: `${BACKEND_URL}/api/exercises/${item.exercise_id}/gif` }}
                      style={styles.similarGif}
                    />
                    <View style={styles.similarInfo}>
                      <Text style={styles.similarName}>{item.name}</Text>
                      <View style={styles.similarMeta}>
                        <View style={[styles.similarBadge, { backgroundColor: simColor + '15' }]}>
                          <Text style={[styles.similarBadgeText, { color: simColor }]}>{EQUIPMENT_ES[item.equipment] || item.equipment}</Text>
                        </View>
                        <Text style={styles.similarTarget}>{item.target}</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={styles.noSimilar}>
                <Ionicons name="search-outline" size={40} color={COLORS.textSecondary} />
                <Text style={styles.noSimilarText}>No se encontraron alternativas</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background },
  errorText: { fontSize: 18, color: COLORS.textSecondary, marginBottom: 16 },
  backBtnAlt: { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: COLORS.accent, borderRadius: 12 },
  backBtnAltText: { color: COLORS.white, fontWeight: '600' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: COLORS.background,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  backBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text, flex: 1, textAlign: 'center' },
  heroSection: {
    alignItems: 'center', paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  heroGif: {
    width: '100%', height: 200, marginBottom: 12,
  },
  heroMeta: { flexDirection: 'row', gap: 10 },
  heroBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
    backgroundColor: COLORS.surface,
  },
  heroBadgeText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, textTransform: 'capitalize' },
  tabContainer: {
    flexDirection: 'row', backgroundColor: COLORS.surface,
    marginHorizontal: 20, marginTop: 16, borderRadius: 12, padding: 4,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: COLORS.white, elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 1 }, shadowRadius: 2 },
  tabText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  tabTextActive: { color: COLORS.text },
  tabContent: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  muscleCard: {
    backgroundColor: COLORS.cardBg, borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: COLORS.border, marginBottom: 20,
  },
  muscleSection: { },
  muscleSectionBorder: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: COLORS.surface },
  muscleLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  muscleDot: { width: 12, height: 12, borderRadius: 3 },
  muscleLabel: { fontSize: 12, fontWeight: '800', color: COLORS.textSecondary, letterSpacing: 2 },
  muscleName: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginLeft: 20, marginBottom: 4 },
  infoRow: {
    flexDirection: 'row', gap: 12, marginBottom: 20,
  },
  infoItem: {
    flex: 1, alignItems: 'center', backgroundColor: COLORS.cardBg, borderRadius: 16,
    padding: 16, borderWidth: 1, borderColor: COLORS.border, gap: 8,
  },
  infoLabel: { fontSize: 11, fontWeight: '600', color: COLORS.textSecondary, textTransform: 'uppercase' },
  infoValue: { fontSize: 13, fontWeight: '700', color: COLORS.text, textTransform: 'capitalize', textAlign: 'center' },
  instructionsContainer: { gap: 16 },
  instructionStep: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  stepNumber: {
    width: 32, height: 32, borderRadius: 10, backgroundColor: COLORS.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  stepNumberText: { fontSize: 14, fontWeight: '800', color: COLORS.white },
  instructionText: { flex: 1, fontSize: 15, lineHeight: 24, color: COLORS.text },
  similarTitle: { fontSize: 20, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  similarSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 20, lineHeight: 20 },
  similarCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.cardBg,
    borderRadius: 14, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: COLORS.border, gap: 12,
  },
  similarGif: {
    width: 48, height: 48, borderRadius: 12, backgroundColor: COLORS.surface,
  },
  similarInfo: { flex: 1 },
  similarName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  similarMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  similarBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  similarBadgeText: { fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
  similarTarget: { fontSize: 12, color: COLORS.textSecondary, textTransform: 'capitalize' },
  noSimilar: { alignItems: 'center', paddingTop: 40, gap: 12 },
  noSimilarText: { fontSize: 16, color: COLORS.textSecondary },
});
