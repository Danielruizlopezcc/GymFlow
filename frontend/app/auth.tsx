import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { COLORS } from '@/src/constants/theme';

export default function AuthCallback() {
  const { processSessionId } = useAuth();
  const params = useLocalSearchParams<{ session_id?: string }>();
  const router = useRouter();

  useEffect(() => {
    const handle = async () => {
      if (params.session_id) {
        await processSessionId(params.session_id);
      }
      router.replace('/');
    };
    handle();
  }, [params.session_id]);

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
