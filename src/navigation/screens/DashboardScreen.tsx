import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useIoT } from '../../context/IoTContext';
import { colors } from '../../theme';

const metrics = [
  { key: 'temperature' as const, label: 'Temperature', icon: 'thermometer-outline' as const, unit: '°C' },
  { key: 'humidity' as const, label: 'Humidity', icon: 'water-outline' as const, unit: '%' },
  { key: 'lightLevel' as const, label: 'Light level', icon: 'sunny-outline' as const, unit: ' lux' },
];

export default function DashboardScreen() {
  const navigation = useNavigation<DrawerNavigationProp<Record<string, undefined>>>();
  const {
    devices,
    sensors,
    isLoadingDevices,
    isLoadingSensors,
    updatingDeviceId,
    gatewayConnected,
    deviceError,
    sensorError,
    loadDevices,
    refreshSensors,
    toggleDevice,
  } = useIoT();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.intro}>
        <Text style={styles.eyebrow}>HOME OVERVIEW</Text>
        <Text style={styles.title}>Your home, at a glance</Text>
        <Text style={styles.subtitle}>Monitor your environment and manage connected devices.</Text>
      </View>

      <View style={[styles.connectionBanner, !gatewayConnected && styles.connectionBannerOffline]}>
        <Ionicons
          name={gatewayConnected ? 'wifi' : 'cloud-offline-outline'}
          size={19}
          color={gatewayConnected ? colors.success : colors.danger}
        />
        <Text style={[styles.connectionText, !gatewayConnected && styles.offlineText]}>
          {gatewayConnected ? 'Gateway connected' : 'IoT Gateway is disconnected.'}
        </Text>
        {!gatewayConnected && (
          <TouchableOpacity onPress={() => void loadDevices()} accessibilityRole="button">
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.sectionHeading}>
        <View>
          <Text style={styles.sectionTitle}>Environment</Text>
          <Text style={styles.sectionSubtitle}>Live sensor readings</Text>
        </View>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => void refreshSensors()}
          disabled={isLoadingSensors}
          accessibilityRole="button"
          accessibilityLabel="Refresh sensor readings"
        >
          {isLoadingSensors
            ? <ActivityIndicator size="small" color={colors.primary} />
            : <Ionicons name="refresh-outline" size={19} color={colors.primary} />}
        </TouchableOpacity>
      </View>

      {sensorError && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{sensorError}</Text>
          <TouchableOpacity onPress={() => void refreshSensors()} accessibilityRole="button">
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.metricGrid}>
        {metrics.map((metric) => {
          const value = sensors?.[metric.key];
          return (
            <View key={metric.key} style={styles.metricCard}>
              <View style={styles.metricIcon}>
                <Ionicons name={metric.icon} size={19} color={colors.primary} />
              </View>
              <Text style={styles.metricLabel}>{metric.label}</Text>
              {value === undefined ? (
                <Text style={styles.metricLoading}>
                  {isLoadingSensors ? 'Loading...' : 'Unavailable'}
                </Text>
              ) : (
                <Text style={styles.metricValue}>
                  {value}<Text style={styles.metricUnit}>{metric.unit}</Text>
                </Text>
              )}
            </View>
          );
        })}
      </View>

      <View style={[styles.sectionHeading, styles.deviceHeading]}>
        <View>
          <Text style={styles.sectionTitle}>Devices</Text>
          <Text style={styles.sectionSubtitle}>
            {devices.length} connected {devices.length === 1 ? 'device' : 'devices'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Devices')}
          accessibilityRole="button"
        >
          <Text style={styles.linkText}>See all</Text>
        </TouchableOpacity>
      </View>

      {deviceError && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{deviceError}</Text>
          <TouchableOpacity onPress={() => void loadDevices()} accessibilityRole="button">
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {isLoadingDevices ? (
        <View style={styles.loadingCard}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.loadingText}>Loading devices...</Text>
        </View>
      ) : devices.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="hardware-chip-outline" size={25} color={colors.icon} />
          <Text style={styles.emptyText}>No devices found. Try loading them again.</Text>
        </View>
      ) : devices.map((device) => (
        <View key={device.id} style={styles.deviceCard}>
          <View style={styles.deviceIcon}>
            <Ionicons name={device.icon} size={21} color={colors.primary} />
          </View>
          <View style={styles.deviceDetails}>
            <Text style={styles.deviceName} numberOfLines={1}>{device.name}</Text>
            <Text style={styles.deviceType}>{device.type}</Text>
          </View>
          <View style={styles.deviceControl}>
            <Text style={[styles.deviceStatus, device.status ? styles.statusOn : styles.statusOff]}>
              {updatingDeviceId === device.id ? 'Updating...' : device.status ? 'ON' : 'OFF'}
            </Text>
            <Switch
              value={device.status}
              disabled={!gatewayConnected || updatingDeviceId !== null}
              onValueChange={(value) => void toggleDevice(device.id, value)}
              trackColor={{ false: colors.border, true: '#A9B9FF' }}
              thumbColor={device.status ? colors.primary : '#FFFFFF'}
              accessibilityLabel={`${device.name}, ${device.status ? 'on' : 'off'}`}
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 36 },
  intro: { marginBottom: 18 },
  eyebrow: { color: colors.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: colors.text, fontSize: 27, fontWeight: '800', marginTop: 8 },
  subtitle: { color: colors.textMuted, fontSize: 14, lineHeight: 21, marginTop: 7 },
  connectionBanner: {
    alignItems: 'center', backgroundColor: colors.successSoft, borderRadius: 12,
    flexDirection: 'row', gap: 9, marginBottom: 25, paddingHorizontal: 14, paddingVertical: 12,
  },
  connectionBannerOffline: { backgroundColor: colors.dangerSoft },
  connectionText: { color: colors.success, flex: 1, fontSize: 13, fontWeight: '700' },
  offlineText: { color: colors.danger },
  sectionHeading: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 13 },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  sectionSubtitle: { color: colors.textMuted, fontSize: 12, marginTop: 3 },
  iconButton: {
    alignItems: 'center', backgroundColor: colors.primarySoft, borderRadius: 12,
    height: 38, justifyContent: 'center', width: 38,
  },
  errorBanner: {
    alignItems: 'center', backgroundColor: colors.dangerSoft, borderRadius: 10,
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, padding: 12,
  },
  errorText: { color: colors.danger, flex: 1, fontSize: 13, marginRight: 10 },
  retryText: { color: colors.primary, fontSize: 13, fontWeight: '800' },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 11 },
  metricCard: {
    backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 16,
    borderWidth: 1, minHeight: 126, padding: 14, width: '48%',
  },
  metricIcon: {
    alignItems: 'center', backgroundColor: colors.primarySoft, borderRadius: 10,
    height: 34, justifyContent: 'center', width: 34,
  },
  metricLabel: { color: colors.textMuted, fontSize: 12, marginTop: 12 },
  metricValue: { color: colors.text, fontSize: 24, fontWeight: '800', marginTop: 3 },
  metricUnit: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  metricLoading: { color: colors.textMuted, fontSize: 15, fontWeight: '600', marginTop: 8 },
  deviceHeading: { marginBottom: 13, marginTop: 28 },
  linkText: { color: colors.primary, fontSize: 13, fontWeight: '800' },
  loadingCard: {
    alignItems: 'center', backgroundColor: colors.surface, borderRadius: 14,
    flexDirection: 'row', gap: 10, padding: 18,
  },
  loadingText: { color: colors.textMuted, fontSize: 13 },
  emptyCard: {
    alignItems: 'center', backgroundColor: colors.surface, borderRadius: 14,
    gap: 8, padding: 20,
  },
  emptyText: { color: colors.textMuted, fontSize: 13, textAlign: 'center' },
  deviceCard: {
    alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border,
    borderRadius: 15, borderWidth: 1, flexDirection: 'row', marginBottom: 10, padding: 13,
  },
  deviceIcon: {
    alignItems: 'center', backgroundColor: colors.primarySoft, borderRadius: 13,
    height: 44, justifyContent: 'center', width: 44,
  },
  deviceDetails: { flex: 1, marginLeft: 12, minWidth: 0 },
  deviceName: { color: colors.text, fontSize: 14, fontWeight: '700' },
  deviceType: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  deviceControl: { alignItems: 'flex-end', marginLeft: 6 },
  deviceStatus: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  statusOn: { color: colors.success },
  statusOff: { color: colors.textMuted },
});
