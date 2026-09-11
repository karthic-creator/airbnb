import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useItems } from '@/store';
import { occurrencesForCategory, isDoneOn } from '@/agenda';
import { categories, categoryOrder, palette } from '@/theme';
import { Fab } from '@/components/Fab';

export default function BoardsScreen() {
  const { items } = useItems();

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const cat of categoryOrder) {
      const occ = occurrencesForCategory(items, cat, 7);
      map[cat] = occ.filter((o) => !isDoneOn(o.item, o.date)).length;
    }
    return map;
  }, [items]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Your life, by area</Text>
        <Text style={styles.subtitle}>Tap an area to plan ahead</Text>
      </View>
      <View style={styles.grid}>
        {categoryOrder.map((catId) => {
          const cat = categories[catId];
          return (
            <Pressable
              key={catId}
              onPress={() => router.push(`/boards/${catId}`)}
              style={({ pressed }) => [styles.card, { backgroundColor: cat.soft, borderColor: cat.color }, pressed && styles.pressed]}
            >
              <Text style={styles.icon}>{cat.icon}</Text>
              <Text style={[styles.label, { color: cat.color }]}>{cat.label}</Text>
              <Text style={styles.count}>
                {counts[catId] ?? 0} upcoming this week
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Fab />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.bg },
  header: { paddingHorizontal: 20, paddingTop: 12, marginBottom: 8 },
  title: { fontSize: 22, fontWeight: '800', color: palette.text },
  subtitle: { fontSize: 14, color: palette.textMuted, marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12 },
  card: {
    width: '46%',
    margin: '2%',
    aspectRatio: 1,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  pressed: { opacity: 0.8 },
  icon: { fontSize: 44, marginBottom: 10 },
  label: { fontSize: 18, fontWeight: '800' },
  count: { fontSize: 12, fontWeight: '600', color: palette.textMuted, marginTop: 6, textAlign: 'center' },
});
