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

const sensorCards = [
  {
    key: 'temperature' as const,
    name: 'Temperature',
    icon: 'thermometer-outline' as const,
    unit: '°C',
    description: 'Current room temperature',
  },
  {
    key: 'humidity' as const,
    name: 'Humidity',
    icon: 'water-outline' as const,
    unit: '%',
    description: 'Current relative humidity',
  },
  {
    key: 'lightLevel' as const,
    name: 'Light level',
    icon: 'sunny-outline' as const,
    unit: ' lux',
    description: 'Current ambient light',
  },
];

export default function SensorsScreen() {
  const { sensors, isLoadingSensors, sensorError, refreshSensors } = useIoT();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>Sensors</Text>
          <Text style={styles.subtitle}>A clear picture of your home environment.</Text>
        </View>
        <TouchableOpacity
          style={[styles.refreshButton, isLoadingSensors && styles.refreshButtonBusy]}
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
          <Ionicons name="alert-circle-outline" size={19} color={colors.danger} />
          <Text style={styles.errorMessage}>{sensorError}</Text>
          <TouchableOpacity onPress={() => void refreshSensors()} accessibilityRole="button">
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.refreshAction}
        onPress={() => void refreshSensors()}
        disabled={isLoadingSensors}
        accessibilityRole="button"
      >
        {isLoadingSensors
          ? <ActivityIndicator size="small" color="#FFFFFF" />
          : <Ionicons name="sync-outline" size={18} color="#FFFFFF" />}
        <Text style={styles.refreshActionText}>
          {isLoadingSensors ? 'Refreshing sensors...' : 'Refresh sensors'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionLabel}>CURRENT READINGS</Text>

      {sensorCards.map((sensor) => {
        const value = sensors?.[sensor.key];
        return (
          <View key={sensor.key} style={styles.sensorCard}>
            <View style={styles.sensorRow}>
              <View style={styles.sensorIcon}>
                <Ionicons name={sensor.icon} size={23} color={colors.primary} />
              </View>
              <View style={styles.sensorInfo}>
                <Text style={styles.sensorName}>{sensor.name}</Text>
                <Text style={styles.description}>{sensor.description}</Text>
              </View>
            </View>
            {value === undefined ? (
              <View style={styles.unavailable}>
                {isLoadingSensors && <ActivityIndicator size="small" color={colors.primary} />}
                <Text style={styles.unavailableText}>
                  {isLoadingSensors ? 'Retrieving reading...' : 'Reading unavailable'}
                </Text>
              </View>
            ) : (
              <Text style={styles.value}>
                {value}<Text style={styles.unit}>{sensor.unit}</Text>
              </Text>
            )}
          </View>
        );
      })}

      <View style={styles.note}>
        <Ionicons name="information-circle-outline" size={18} color={colors.icon} />
        <Text style={styles.noteText}>Sensor readings are provided by your IoT gateway.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 36 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 19 },
  headerCopy: { flex: 1, marginRight: 12 },
  title: { color: colors.text, fontSize: 27, fontWeight: '800' },
  subtitle: { color: colors.textMuted, fontSize: 14, lineHeight: 20, marginTop: 6 },
  refreshButton: {
    alignItems: 'center', backgroundColor: colors.primarySoft, borderRadius: 12,
    height: 40, justifyContent: 'center', width: 40,
  },
  refreshButtonBusy: { opacity: 0.7 },
  errorBanner: {
    alignItems: 'center', backgroundColor: colors.dangerSoft, borderRadius: 11,
    flexDirection: 'row', gap: 8, marginBottom: 14, padding: 12,
  },
  errorMessage: { color: colors.danger, flex: 1, fontSize: 13 },
  retryText: { color: colors.primary, fontSize: 13, fontWeight: '800' },
  refreshAction: {
    alignItems: 'center', backgroundColor: colors.primary, borderRadius: 13,
    flexDirection: 'row', gap: 9, justifyContent: 'center', marginBottom: 25, padding: 14,
  },
  refreshActionText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  sectionLabel: { color: colors.textMuted, fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 11 },
  sensorCard: {
    backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 16,
    borderWidth: 1, marginBottom: 12, padding: 17,
  },
  sensorRow: { alignItems: 'center', flexDirection: 'row' },
  sensorIcon: {
    alignItems: 'center', backgroundColor: colors.primarySoft, borderRadius: 13,
    height: 46, justifyContent: 'center', width: 46,
  },
  sensorInfo: { flex: 1, marginLeft: 13 },
  sensorName: { color: colors.text, fontSize: 15, fontWeight: '700' },
  description: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  value: { color: colors.text, fontSize: 32, fontWeight: '800', marginLeft: 59, marginTop: 17 },
  unit: { color: colors.textMuted, fontSize: 15, fontWeight: '600' },
  unavailable: { alignItems: 'center', flexDirection: 'row', gap: 8, marginLeft: 59, marginTop: 17 },
  unavailableText: { color: colors.textMuted, fontSize: 13 },
  note: { alignItems: 'center', flexDirection: 'row', gap: 7, marginTop: 7 },
  noteText: { color: colors.textMuted, flex: 1, fontSize: 12 },
});
