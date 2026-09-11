import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Item } from '@/types';
import { categories, palette } from '@/theme';
import { formatTime } from '@/time';
import { isDoneOn } from '@/agenda';
import { useItems } from '@/store';

export function ItemRow({ item, dateISO }: { item: Item; dateISO: string }) {
  const { toggleDone, deleteItem } = useItems();
  const done = isDoneOn(item, dateISO);
  const cat = categories[item.category];

  const onLongPress = () => {
    Alert.alert(item.title, 'Remove this from your plan?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteItem(item.id) },
    ]);
  };

  return (
    <Pressable
      onPress={() => toggleDone(item.id, dateISO)}
      onLongPress={onLongPress}
      style={({ pressed }) => [styles.row, done && styles.rowDone, pressed && styles.pressed]}
    >
      <Text style={styles.time}>{formatTime(item.time)}</Text>
      <View style={[styles.iconWrap, { backgroundColor: cat.soft }]}>
        <Text style={styles.icon}>{item.icon}</Text>
      </View>
      <View style={styles.body}>
        <Text style={[styles.title, done && styles.titleDone]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.category, { color: cat.color }]}>{cat.label}</Text>
      </View>
      <View style={[styles.check, done && { backgroundColor: cat.color, borderColor: cat.color }]}>
        {done && <Text style={styles.checkMark}>✓</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.card,
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: palette.border,
  },
  rowDone: { opacity: 0.55 },
  pressed: { opacity: 0.75 },
  time: { width: 68, fontSize: 13, fontWeight: '700', color: palette.textMuted },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: { fontSize: 24 },
  body: { flex: 1 },
  title: { fontSize: 17, fontWeight: '700', color: palette.text },
  titleDone: { textDecorationLine: 'line-through', color: palette.textMuted },
  category: { fontSize: 12, fontWeight: '700', marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.4 },
  check: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: { color: '#fff', fontWeight: '900', fontSize: 15 },
});
