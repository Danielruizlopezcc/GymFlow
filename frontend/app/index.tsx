import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, StatusBar, Platform, Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/src/contexts/AuthContext';
import { COLORS } from '@/src/constants/theme';

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
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  if (user) return null;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]} testID="login-screen">
      <StatusBar barStyle="dark-content" />

      <View style={styles.heroSection}>
        <View style={styles.iconContainer}>
          <Ionicons name="barbell" size={64} color={COLORS.accent} />
        </View>
        <Text style={styles.appName}>GYMFLOW</Text>
        <Text style={styles.tagline}>Your personal training companion</Text>
      </View>

      <View style={styles.featuresSection}>
        {[
          { icon: 'fitness-outline' as const, title: 'Exercise Library', desc: '80+ exercises with detailed instructions' },
          { icon: 'calendar-outline' as const, title: 'Workout Planner', desc: 'Plan your training week ahead' },
          { icon: 'swap-horizontal-outline' as const, title: 'Smart Alternatives', desc: 'Find similar exercises when machines are busy' },
        ].map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <View style={[styles.featureIcon, { backgroundColor: COLORS.accentLight }]}>
              <Ionicons name={f.icon} size={22} color={COLORS.accent} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 20 }]}>
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
          <Text style={styles.googleBtnText}>Continue with Google</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          By continuing, you agree to our Terms & Privacy Policy
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: COLORS.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  appName: {
    fontSize: 36,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: 3,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  featuresSection: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  featureDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
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
  },
});
