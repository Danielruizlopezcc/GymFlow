import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, StatusBar, Image, ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/src/contexts/AuthContext';
import { COLORS } from '@/src/constants/theme';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=1200&q=80';
const FEATURE_LIBRARY = 'https://images.unsplash.com/photo-1716996236828-18583f5abe5d?w=400&q=80';
const FEATURE_PLANNER = 'https://images.unsplash.com/photo-1692158961713-73690ef06e6e?w=400&q=80';
const FEATURE_ALT = 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&q=80';

export default function LoginScreen() {
  const { user, loading, login } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    if (!loading && user) {
      router.replace('/(tabs)/exercises');
    }
  }, [loading, user]);

  if (loading) {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  if (user) return null;

  const features = [
    { img: FEATURE_LIBRARY, title: 'Biblioteca de Ejercicios', desc: '80+ ejercicios con instrucciones detalladas' },
    { img: FEATURE_PLANNER, title: 'Planificador Semanal', desc: 'Organiza tus rutinas día por día' },
    { img: FEATURE_ALT, title: 'Alternativas Inteligentes', desc: 'Encuentra ejercicios similares si la máquina está ocupada' },
  ];

  return (
    <View style={styles.container} testID="login-screen">
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        {/* HERO IMAGE with gradient overlay */}
        <View style={styles.heroWrapper}>
          <Image source={{ uri: HERO_IMAGE }} style={styles.heroImage} resizeMode="cover" />
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.4)', 'rgba(255,255,255,1)']}
            locations={[0, 0.55, 1]}
            style={styles.heroGradient}
          />
          <View style={[styles.heroContent, { paddingTop: insets.top + 24 }]}>
            <Text style={styles.appName}>GYMFLOW</Text>
            <Text style={styles.tagline}>Tu compañero de entrenamiento personal</Text>
          </View>
        </View>

        {/* FEATURES */}
        <View style={styles.featuresSection}>
          {features.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <Image source={{ uri: f.img }} style={styles.featureImage} />
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* CTA */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            testID="google-login-btn"
            style={styles.googleBtn}
            onPress={login}
            activeOpacity={0.85}
          >
            <Image
              source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
              style={styles.googleIcon}
            />
            <Text style={styles.googleBtnText}>Continuar con Google</Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            Al continuar, aceptas nuestros Términos y Política de Privacidad
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: { alignItems: 'center', justifyContent: 'center' },
  heroWrapper: {
    height: 360,
    width: '100%',
    position: 'relative',
    backgroundColor: '#000',
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    paddingBottom: 32,
  },
  appName: {
    fontSize: 44,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 4,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.92)',
    marginTop: 6,
    fontWeight: '500',
  },
  featuresSection: {
    paddingHorizontal: 24,
    paddingTop: 8,
    gap: 18,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  featureImage: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  featureDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 3,
    lineHeight: 18,
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.text,
    height: 56,
    borderRadius: 28,
    gap: 12,
  },
  googleIcon: {
    width: 20,
    height: 20,
  },
  googleBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.white,
  },
  disclaimer: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 12,
  },
});
