import React, { useRef, useEffect } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/contexts/AuthContext';
import { COLORS } from '@/src/constants/theme';
import {
  View, Text, TouchableOpacity, Animated,
  ActivityIndicator, StyleSheet, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const SCREEN_W = Dimensions.get('window').width;

const TABS = [
  { name: 'exercises',  iconActive: 'barbell',          iconIdle: 'barbell-outline',   label: 'Ejercicios'  },
  { name: 'calendar',   iconActive: 'calendar',          iconIdle: 'calendar-outline',  label: 'Plan'        },
  { name: 'profile',    iconActive: 'person',            iconIdle: 'person-outline',    label: 'Perfil'      },
] as const;

// ── Barra inferior personalizada ─────────────────────────────
function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets  = useSafeAreaInsets();
  const tabW    = SCREEN_W / TABS.length;

  // Posición X del centro del indicador
  const pillX = useRef(new Animated.Value(state.index * tabW)).current;

  useEffect(() => {
    Animated.spring(pillX, {
      toValue: state.index * tabW,
      useNativeDriver: true,
      stiffness: 380,
      damping:   28,
      mass:      0.7,
    }).start();
  }, [state.index]);

  const barH     = 56;
  const totalH   = barH + (insets.bottom || 16);
  const pillW    = tabW * 0.48;   // ancho de la píldora
  const pillOff  = (tabW - pillW) / 2; // centrar dentro de la columna

  return (
    <View style={[styles.bar, { height: totalH, paddingBottom: insets.bottom || 16 }]}>

      {/* ── Píldora deslizante ── */}
      <Animated.View
        style={[
          styles.pill,
          {
            width:  pillW,
            top:    10,
            height: barH - 20,
            transform: [{ translateX: Animated.add(pillX, new Animated.Value(pillOff)) }],
          },
        ]}
      />

      {/* ── Tabs ── */}
      {TABS.map((tab, i) => {
        const active = state.index === i;
        return (
          <TouchableOpacity
            key={tab.name}
            testID={`tab-${tab.name}`}
            style={styles.tabItem}
            activeOpacity={0.75}
            onPress={() => navigation.navigate(tab.name)}
          >
            <Ionicons
              name={active ? tab.iconActive : tab.iconIdle}
              size={22}
              color={active ? COLORS.accent : COLORS.tabInactive}
            />
            <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ── Layout principal ─────────────────────────────────────────
export default function TabLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/');
  }, [loading, user]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  if (!user) return null;

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="exercises" options={{ title: 'Ejercicios' }} />
      <Tabs.Screen name="calendar"  options={{ title: 'Plan'       }} />
      <Tabs.Screen name="profile"   options={{ title: 'Perfil'     }} />
    </Tabs>
  );
}

// ── Estilos ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.background,
  },

  bar: {
    flexDirection:   'row',
    backgroundColor: COLORS.white,
    borderTopWidth:  1,
    borderTopColor:  COLORS.border,
    // Sombra suave
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: -2 },
    shadowOpacity:   0.05,
    shadowRadius:    8,
    elevation:       8,
  },

  // Píldora de fondo que se desliza
  pill: {
    position:        'absolute',
    left:            0,
    borderRadius:    14,
    backgroundColor: COLORS.accentLight,   // azul muy claro
  },

  tabItem: {
    flex:            1,
    alignItems:      'center',
    justifyContent:  'center',
    paddingTop:      8,
    gap:             3,
  },

  tabLabel: {
    fontSize:    10,
    fontWeight:  '500',
    color:       COLORS.tabInactive,
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    fontWeight:  '700',
    color:       COLORS.accent,
  },
});
