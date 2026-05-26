/**
 * Pantalla de callback de autenticación.
 *
 * Con Supabase Auth:
 * - Web: el cliente detecta el token del hash automáticamente.
 *   Redirigimos directamente a la raíz y el AuthProvider se encarga.
 * - Mobile: el flujo PKCE se maneja en AuthContext.login().
 *   Si el deep link aterriza aquí, simplemente volvemos a la raíz.
 */
import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@/src/constants/theme';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // El AuthProvider detecta el cambio de sesión vía onAuthStateChange.
    // Solo necesitamos redirigir al inicio.
    router.replace('/');
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
});
