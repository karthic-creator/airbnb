import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { palette } from '@/theme';

interface Integration {
  icon: string;
  name: string;
  status: 'Not connected' | 'Planned';
  blurb: string;
  needs: string;
}

const integrations: Integration[] = [
  {
    icon: '📅',
    name: 'Google Calendar & Meet',
    status: 'Not connected',
    blurb: 'Pull your real events and Meet links straight into Today and Boards.',
    needs: 'A Google Cloud project with OAuth credentials, and you signing in from the app.',
  },
  {
    icon: '💬',
    name: 'WhatsApp',
    status: 'Not connected',
    blurb: 'Turn commitments made over WhatsApp into timed items automatically.',
    needs: 'A WhatsApp Business API account (via Meta) — personal WhatsApp has no integration API.',
  },
  {
    icon: '📞',
    name: 'Phone calls',
    status: 'Not connected',
    blurb: 'Log call commitments and follow-ups right after you hang up.',
    needs: 'Call-log/contacts permission on your device (Android only — iOS blocks this by policy).',
  },
  {
    icon: '⌚',
    name: 'Wearable',
    status: 'Planned',
    blurb: 'Use heart-rate/focus signals to time nudges for the right moment, not just the right time.',
    needs: 'A wearable with an open SDK (e.g. Apple Watch, Wear OS, Garmin, Oura) — tell me which one and I\'ll scope it.',
  },
];

export default function SettingsScreen() {
  const resetData = () => {
    Alert.alert('Reset sample data', 'This clears everything and reloads the starter plan. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('compass:items:v1');
          Alert.alert('Done', 'Restart the app to see the fresh sample data.');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Settings</Text>

        <Text style={styles.sectionTitle}>Connect your world</Text>
        <Text style={styles.sectionSubtitle}>
          Today, Compass runs entirely on your own entries, stored only on this device. These are next up —
          each needs a bit of one-time setup on your side before I can wire it in.
        </Text>
        {integrations.map((it) => (
          <View key={it.name} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>{it.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardName}>{it.name}</Text>
                <Text style={styles.cardStatus}>{it.status}</Text>
              </View>
            </View>
            <Text style={styles.cardBlurb}>{it.blurb}</Text>
            <Text style={styles.cardNeeds}>Needs: {it.needs}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Data</Text>
        <Text onPress={resetData} style={styles.resetLink}>
          Reset to sample data
        </Text>

        <Text style={styles.footer}>Compass v1 · your data stays on this device</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.bg },
  scroll: { padding: 20, paddingBottom: 60 },
  title: { fontSize: 26, fontWeight: '800', color: palette.text, marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: palette.textMuted, marginTop: 12, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionSubtitle: { fontSize: 13, color: palette.textMuted, marginBottom: 14, lineHeight: 19 },
  card: {
    backgroundColor: palette.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 14,
    marginBottom: 12,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cardIcon: { fontSize: 28, marginRight: 12 },
  cardName: { fontSize: 16, fontWeight: '800', color: palette.text },
  cardStatus: { fontSize: 12, fontWeight: '700', color: palette.textMuted, marginTop: 2 },
  cardBlurb: { fontSize: 14, color: palette.text, marginBottom: 6, lineHeight: 20 },
  cardNeeds: { fontSize: 12, color: palette.textMuted, fontStyle: 'italic', lineHeight: 18 },
  resetLink: { color: palette.now, fontWeight: '700', fontSize: 15, marginTop: 4 },
  footer: { textAlign: 'center', color: palette.textMuted, fontSize: 12, marginTop: 40 },
});
