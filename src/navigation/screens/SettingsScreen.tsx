import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIoT } from '../../context/IoTContext';
import { colors } from '../../theme';

export default function SettingsScreen() {
  const {
    devices,
    sensors,
    isLoadingDevices,
    gatewayConnected,
    loadDevices,
  } = useIoT();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Connection and app information.</Text>

      <Text style={styles.sectionLabel}>IOT GATEWAY</Text>
      <View style={styles.connectionCard}>
        <View style={styles.connectionHeading}>
          <View style={[styles.connectionIcon, gatewayConnected ? styles.onlineIcon : styles.offlineIcon]}>
            <Ionicons
              name={gatewayConnected ? 'cloud-done-outline' : 'cloud-offline-outline'}
              size={23}
              color={gatewayConnected ? colors.success : colors.danger}
            />
          </View>
          <View style={styles.connectionInfo}>
            <Text style={styles.connectionTitle}>Gateway connection</Text>
            <Text style={[styles.connectionStatus, !gatewayConnected && styles.offlineText]}>
              {gatewayConnected ? 'Connected and responding' : 'Disconnected'}
            </Text>
          </View>
        </View>

        {!gatewayConnected && (
          <View style={styles.warningBanner}>
            <Ionicons name="alert-circle-outline" size={17} color={colors.warning} />
            <Text style={styles.warningText}>Device controls are disabled until the gateway reconnects.</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.connectButton, isLoadingDevices && styles.disabledButton]}
          onPress={() => void loadDevices()}
          disabled={isLoadingDevices}
          accessibilityRole="button"
        >
          {isLoadingDevices
            ? <ActivityIndicator size="small" color="#FFFFFF" />
            : <Ionicons name="refresh-outline" size={17} color="#FFFFFF" />}
          <Text style={styles.connectButtonText}>
            {isLoadingDevices ? 'Checking connection...' : gatewayConnected ? 'Check connection' : 'Reconnect gateway'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionLabel}>SYSTEM STATUS</Text>
      <View style={styles.statusCard}>
        <StatusRow
          icon="hardware-chip-outline"
          label="Connected devices"
          value={isLoadingDevices ? 'Loading...' : `${devices.length}`}
        />
        <View style={styles.divider} />
        <StatusRow
          icon="analytics-outline"
          label="Sensor readings"
          value={sensors ? 'Available' : 'Unavailable'}
          valueColor={sensors ? colors.success : colors.textMuted}
        />
      </View>

      <View style={styles.infoCard}>
        <Ionicons name="code-slash-outline" size={20} color={colors.primary} />
        <View style={styles.infoCopy}>
          <Text style={styles.infoTitle}>Backend integration ready</Text>
          <Text style={styles.infoText}>
            Device, sensor, and gateway data are accessed through the IoT service layer.
            Connect your API there to replace the simulated responses.
          </Text>
        </View>
      </View>

      <Text style={styles.footer}>IoT Home · Smart Environment</Text>
    </ScrollView>
  );
}

function StatusRow({
  icon,
  label,
  value,
  valueColor = colors.text,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View style={styles.statusRow}>
      <Ionicons name={icon} size={19} color={colors.icon} />
      <Text style={styles.statusLabel}>{label}</Text>
      <Text style={[styles.statusValue, { color: valueColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 36 },
  title: { color: colors.text, fontSize: 27, fontWeight: '800' },
  subtitle: { color: colors.textMuted, fontSize: 14, marginBottom: 26, marginTop: 6 },
  sectionLabel: { color: colors.textMuted, fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 11 },
  connectionCard: {
    backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 16,
    borderWidth: 1, marginBottom: 25, padding: 16,
  },
  connectionHeading: { alignItems: 'center', flexDirection: 'row' },
  connectionIcon: {
    alignItems: 'center', borderRadius: 14, height: 48, justifyContent: 'center', width: 48,
  },
  onlineIcon: { backgroundColor: colors.successSoft },
  offlineIcon: { backgroundColor: colors.dangerSoft },
  connectionInfo: { flex: 1, marginLeft: 13 },
  connectionTitle: { color: colors.text, fontSize: 15, fontWeight: '700' },
  connectionStatus: { color: colors.success, fontSize: 12, marginTop: 4 },
  offlineText: { color: colors.danger },
  warningBanner: {
    alignItems: 'center', backgroundColor: colors.warningSoft, borderRadius: 10,
    flexDirection: 'row', gap: 7, marginTop: 15, padding: 11,
  },
  warningText: { color: colors.warning, flex: 1, fontSize: 12, lineHeight: 17 },
  connectButton: {
    alignItems: 'center', backgroundColor: colors.primary, borderRadius: 11,
    flexDirection: 'row', gap: 8, justifyContent: 'center', marginTop: 16, padding: 13,
  },
  disabledButton: { opacity: 0.65 },
  connectButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  statusCard: {
    backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 16,
    borderWidth: 1, marginBottom: 20, paddingHorizontal: 15,
  },
  statusRow: { alignItems: 'center', flexDirection: 'row', gap: 10, paddingVertical: 15 },
  statusLabel: { color: colors.textMuted, flex: 1, fontSize: 13 },
  statusValue: { fontSize: 13, fontWeight: '700' },
  divider: { backgroundColor: colors.border, height: 1 },
  infoCard: {
    alignItems: 'flex-start', backgroundColor: colors.primarySoft, borderRadius: 15,
    flexDirection: 'row', gap: 11, padding: 15,
  },
  infoCopy: { flex: 1 },
  infoTitle: { color: colors.text, fontSize: 14, fontWeight: '800' },
  infoText: { color: colors.textMuted, fontSize: 12, lineHeight: 18, marginTop: 5 },
  footer: { color: colors.textMuted, fontSize: 11, marginTop: 26, textAlign: 'center' },
});
