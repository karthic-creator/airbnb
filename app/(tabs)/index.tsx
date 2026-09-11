import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useItems } from '@/store';
import { itemsForDate, isDoneOn } from '@/agenda';
import { todayISO, nowHHmm, minutesSinceMidnight, formatTime } from '@/time';
import { categories, palette } from '@/theme';
import { ItemRow } from '@/components/ItemRow';
import { Fab } from '@/components/Fab';

export default function TodayScreen() {
  const { items, loading } = useItems();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const dateISO = todayISO(now);
  const nowMin = minutesSinceMidnight(nowHHmm(now));

  const todays = useMemo(() => itemsForDate(items, dateISO), [items, dateISO]);

  const active = todays.find((i) => {
    const start = minutesSinceMidnight(i.time);
    return nowMin >= start && nowMin < start + i.durationMinutes && !isDoneOn(i, dateISO);
  });
  const next = todays.find((i) => minutesSinceMidnight(i.time) > nowMin && !isDoneOn(i, dateISO));
  const hero = active ?? next;
  const heroLabel = active ? 'RIGHT NOW' : 'UP NEXT';
  const heroCat = hero ? categories[hero.category] : null;

  const dateLabel = now.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
  const timeLabel = now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.date}>{dateLabel}</Text>
          <Text style={styles.clock}>{timeLabel}</Text>
        </View>

        {hero && heroCat ? (
          <View style={[styles.hero, { backgroundColor: heroCat.soft, borderColor: heroCat.color }]}>
            <Text style={[styles.heroLabel, { color: heroCat.color }]}>{heroLabel}</Text>
            <View style={styles.heroBody}>
              <Text style={styles.heroIcon}>{hero.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.heroTitle}>{hero.title}</Text>
                <Text style={styles.heroTime}>
                  {formatTime(hero.time)} · {heroCat.label}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={[styles.hero, { backgroundColor: palette.card, borderColor: palette.border }]}>
            <Text style={styles.heroClear}>You're clear 🎉</Text>
            <Text style={styles.heroTime}>Nothing left scheduled for today.</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Today's plan</Text>
        {loading ? (
          <Text style={styles.muted}>Loading…</Text>
        ) : todays.length === 0 ? (
          <Text style={styles.muted}>Nothing planned yet. Tap + to add something.</Text>
        ) : (
          todays.map((item) => <ItemRow key={item.id} item={item} dateISO={dateISO} />)
        )}
      </ScrollView>
      <Fab />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.bg },
  scroll: { padding: 20, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  date: { fontSize: 20, fontWeight: '800', color: palette.text },
  clock: { fontSize: 20, fontWeight: '800', color: palette.textMuted },
  hero: { borderRadius: 22, borderWidth: 2, padding: 18, marginBottom: 22 },
  heroLabel: { fontSize: 13, fontWeight: '800', letterSpacing: 1, marginBottom: 10 },
  heroBody: { flexDirection: 'row', alignItems: 'center' },
  heroIcon: { fontSize: 44, marginRight: 16 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: palette.text },
  heroTime: { fontSize: 14, fontWeight: '600', color: palette.textMuted, marginTop: 4 },
  heroClear: { fontSize: 22, fontWeight: '800', color: palette.text, marginBottom: 4 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: palette.textMuted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.6 },
  muted: { color: palette.textMuted, fontSize: 15 },
});
