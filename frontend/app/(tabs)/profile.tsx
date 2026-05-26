import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/src/contexts/AuthContext';
import { COLORS } from '@/src/constants/theme';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]} testID="profile-screen">
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>PROFILE</Text>
      </View>

      <View style={styles.content}>
        {/* User Card */}
        <View style={styles.userCard}>
          {user?.picture ? (
            <Image source={{ uri: user.picture }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Ionicons name="person" size={32} color={COLORS.textSecondary} />
            </View>
          )}
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <View style={styles.menuCard}>
            {[
              { icon: 'fitness-outline', label: 'My Workouts', color: COLORS.accent },
              { icon: 'trophy-outline', label: 'Achievements', color: COLORS.warning },
              { icon: 'stats-chart-outline', label: 'Statistics', color: COLORS.success },
              { icon: 'settings-outline', label: 'Settings', color: COLORS.textSecondary },
            ].map((item, idx) => (
              <TouchableOpacity
                key={idx}
                testID={`profile-menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                style={[styles.menuItem, idx < 3 && styles.menuItemBorder]}
              >
                <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
                  <Ionicons name={item.icon as any} size={22} color={item.color} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          testID="logout-btn"
          style={styles.logoutBtn}
          onPress={logout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>GymFlow v1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  header: {
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
    backgroundColor: COLORS.background,
  },
  headerTitle: { fontSize: 28, fontWeight: '900', color: COLORS.text, letterSpacing: 2 },
  content: { flex: 1, padding: 20 },
  userCard: {
    alignItems: 'center', backgroundColor: COLORS.cardBg, borderRadius: 20,
    padding: 24, borderWidth: 1, borderColor: COLORS.border, marginBottom: 24,
  },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 16 },
  avatarPlaceholder: {
    backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center',
  },
  userName: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  userEmail: { fontSize: 14, color: COLORS.textSecondary, marginTop: 4 },
  menuSection: { marginBottom: 24 },
  menuCard: {
    backgroundColor: COLORS.cardBg, borderRadius: 16,
    borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14,
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.surface },
  menuIcon: {
    width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
  menuLabel: { flex: 1, fontSize: 16, fontWeight: '600', color: COLORS.text },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 16, backgroundColor: COLORS.cardBg,
    borderRadius: 14, borderWidth: 1, borderColor: COLORS.danger + '30',
  },
  logoutText: { fontSize: 16, fontWeight: '600', color: COLORS.danger },
  version: {
    textAlign: 'center', fontSize: 12, color: COLORS.textSecondary, marginTop: 24,
  },
});
