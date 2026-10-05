import React from 'react';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Text, View, StyleSheet } from 'react-native';
import { useIoT } from '../context/IoTContext';
import { colors } from '../theme';

export default function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { gatewayConnected } = useIoT();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="hardware-chip-outline" size={27} color="#FFFFFF" />
        </View>
        <Text style={styles.title}>IoT Home</Text>
        <Text style={styles.subtitle}>Smart Environment</Text>
        <View style={[styles.gatewayBadge, !gatewayConnected && styles.gatewayBadgeOffline]}>
          <View style={[styles.dot, !gatewayConnected && styles.dotOffline]} />
          <Text style={[styles.gatewayText, !gatewayConnected && styles.gatewayTextOffline]}>
            {gatewayConnected ? 'Gateway online' : 'Gateway offline'}
          </Text>
        </View>
      </View>

      <View style={styles.menu}>
        <DrawerItemList {...props} />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: 'flex-start', backgroundColor: colors.background, borderRadius: 18,
    marginHorizontal: 14, marginTop: 8, padding: 18,
  },
  logoContainer: {
    alignItems: 'center', backgroundColor: colors.primary, borderRadius: 13,
    height: 48, justifyContent: 'center', width: 48,
  },
  title: { color: colors.text, fontSize: 21, fontWeight: '800', marginTop: 14 },
  subtitle: { color: colors.textMuted, fontSize: 12, marginTop: 3 },
  gatewayBadge: {
    alignItems: 'center', backgroundColor: colors.successSoft, borderRadius: 20,
    flexDirection: 'row', gap: 7, marginTop: 14, paddingHorizontal: 10, paddingVertical: 7,
  },
  gatewayBadgeOffline: { backgroundColor: colors.dangerSoft },
  dot: { backgroundColor: colors.success, borderRadius: 4, height: 7, width: 7 },
  dotOffline: { backgroundColor: colors.danger },
  gatewayText: { color: colors.success, fontSize: 11, fontWeight: '700' },
  gatewayTextOffline: { color: colors.danger },
  menu: { marginTop: 18, paddingHorizontal: 5 },
});
