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
import { useIoT } from '../../context/IoTContext';
import { colors } from '../../theme';

export default function DevicesScreen() {
  const {
    devices,
    isLoadingDevices,
    updatingDeviceId,
    gatewayConnected,
    deviceError,
    loadDevices,
    toggleDevice,
  } = useIoT();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.heading}>
        <View style={styles.headingCopy}>
          <Text style={styles.title}>Devices</Text>
          <Text style={styles.subtitle}>Control your connected home devices.</Text>
        </View>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => void loadDevices()}
          disabled={isLoadingDevices}
          accessibilityRole="button"
          accessibilityLabel="Refresh devices"
        >
          {isLoadingDevices
            ? <ActivityIndicator size="small" color={colors.primary} />
            : <Ionicons name="refresh-outline" size={19} color={colors.primary} />}
        </TouchableOpacity>
      </View>

      <View style={[styles.gatewayBanner, !gatewayConnected && styles.gatewayOffline]}>
        <Ionicons
          name={gatewayConnected ? 'cloud-done-outline' : 'cloud-offline-outline'}
          size={20}
          color={gatewayConnected ? colors.success : colors.danger}
        />
        <Text style={[styles.gatewayText, !gatewayConnected && styles.errorText]}>
          {gatewayConnected ? 'Gateway connected' : 'IoT Gateway is disconnected.'}
        </Text>
        {!gatewayConnected && (
          <TouchableOpacity onPress={() => void loadDevices()} accessibilityRole="button">
            <Text style={styles.link}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>

      {deviceError && (
        <View style={styles.errorBanner}>
          <Ionicons name="alert-circle-outline" size={18} color={colors.danger} />
          <Text style={styles.errorMessage}>{deviceError}</Text>
          <TouchableOpacity onPress={() => void loadDevices()} accessibilityRole="button">
            <Text style={styles.link}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.count}>
        {devices.length} {devices.length === 1 ? 'DEVICE' : 'DEVICES'}
      </Text>

      {isLoadingDevices ? (
        <View style={styles.loadingCard}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.loadingText}>Loading devices...</Text>
        </View>
      ) : devices.length === 0 ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIcon}>
            <Ionicons name="hardware-chip-outline" size={25} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>No devices to show</Text>
          <Text style={styles.emptyMessage}>Check your gateway connection and try again.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => void loadDevices()}>
            <Text style={styles.retryButtonText}>Load devices</Text>
          </TouchableOpacity>
        </View>
      ) : devices.map((device) => (
        <View key={device.id} style={styles.deviceCard}>
          <View style={styles.deviceRow}>
            <View style={[styles.deviceIcon, device.status && styles.deviceIconOn]}>
              <Ionicons name={device.icon} size={23} color={device.status ? colors.primary : colors.icon} />
            </View>
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>{device.name}</Text>
              <Text style={styles.deviceType}>{device.type}</Text>
            </View>
            <View style={styles.deviceAction}>
              <Text style={[styles.status, device.status ? styles.statusOn : styles.statusOff]}>
                {updatingDeviceId === device.id ? 'UPDATING' : device.status ? 'ON' : 'OFF'}
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
          {updatingDeviceId === device.id && (
            <View style={styles.updatingRow}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.updatingText}>Sending command to device...</Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 36 },
  heading: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 19 },
  headingCopy: { flex: 1, marginRight: 12 },
  title: { color: colors.text, fontSize: 27, fontWeight: '800' },
  subtitle: { color: colors.textMuted, fontSize: 14, lineHeight: 20, marginTop: 6 },
  refreshButton: {
    alignItems: 'center', backgroundColor: colors.primarySoft, borderRadius: 12,
    height: 40, justifyContent: 'center', width: 40,
  },
  gatewayBanner: {
    alignItems: 'center', backgroundColor: colors.successSoft, borderRadius: 12,
    flexDirection: 'row', gap: 9, marginBottom: 14, paddingHorizontal: 13, paddingVertical: 12,
  },
  gatewayOffline: { backgroundColor: colors.dangerSoft },
  gatewayText: { color: colors.success, flex: 1, fontSize: 13, fontWeight: '700' },
  errorText: { color: colors.danger },
  errorBanner: {
    alignItems: 'center', backgroundColor: colors.dangerSoft, borderRadius: 11,
    flexDirection: 'row', gap: 8, marginBottom: 14, padding: 12,
  },
  errorMessage: { color: colors.danger, flex: 1, fontSize: 13 },
  link: { color: colors.primary, fontSize: 13, fontWeight: '800' },
  count: { color: colors.textMuted, fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 11, marginTop: 10 },
  loadingCard: {
    alignItems: 'center', backgroundColor: colors.surface, borderRadius: 16,
    flexDirection: 'row', gap: 11, padding: 20,
  },
  loadingText: { color: colors.textMuted, fontSize: 14 },
  emptyCard: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: 16, padding: 24 },
  emptyIcon: {
    alignItems: 'center', backgroundColor: colors.primarySoft, borderRadius: 15,
    height: 48, justifyContent: 'center', width: 48,
  },
  emptyTitle: { color: colors.text, fontSize: 16, fontWeight: '800', marginTop: 12 },
  emptyMessage: { color: colors.textMuted, fontSize: 13, lineHeight: 19, marginTop: 5, textAlign: 'center' },
  retryButton: { backgroundColor: colors.primary, borderRadius: 10, marginTop: 16, paddingHorizontal: 16, paddingVertical: 10 },
  retryButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  deviceCard: {
    backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 16,
    borderWidth: 1, marginBottom: 11, padding: 14,
  },
  deviceRow: { alignItems: 'center', flexDirection: 'row' },
  deviceIcon: {
    alignItems: 'center', backgroundColor: colors.surfaceMuted, borderRadius: 14,
    height: 49, justifyContent: 'center', width: 49,
  },
  deviceIconOn: { backgroundColor: colors.primarySoft },
  deviceInfo: { flex: 1, marginLeft: 13, minWidth: 0 },
  deviceName: { color: colors.text, fontSize: 15, fontWeight: '700' },
  deviceType: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  deviceAction: { alignItems: 'flex-end', marginLeft: 8 },
  status: { fontSize: 10, fontWeight: '800', letterSpacing: 0.7, marginBottom: 1 },
  statusOn: { color: colors.success },
  statusOff: { color: colors.textMuted },
  updatingRow: { alignItems: 'center', flexDirection: 'row', gap: 8, marginTop: 11 },
  updatingText: { color: colors.primary, fontSize: 12, fontWeight: '600' },
});
