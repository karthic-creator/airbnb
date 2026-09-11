import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useItems } from '@/store';
import { categories, categoryOrder, iconChoices, palette } from '@/theme';
import { todayISO } from '@/time';
import type { Category, Recurrence } from '@/types';

const recurrenceOptions: { id: Recurrence; label: string }[] = [
  { id: 'none', label: 'Just once' },
  { id: 'daily', label: 'Every day' },
  { id: 'weekdays', label: 'Weekdays' },
  { id: 'weekly', label: 'Weekly' },
];

export default function AddScreen() {
  const { addItem } = useItems();
  const [category, setCategory] = useState<Category>('personal');
  const [icon, setIcon] = useState<string>(categories.personal.icon);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');
  const [duration, setDuration] = useState(30);
  const [recurrence, setRecurrence] = useState<Recurrence>('none');

  const canSave = title.trim().length > 0;

  const onSave = async () => {
    if (!canSave) return;
    const hh = String(time.getHours()).padStart(2, '0');
    const mm = String(time.getMinutes()).padStart(2, '0');
    await addItem({
      title: title.trim(),
      category,
      icon,
      date: todayISO(),
      time: `${hh}:${mm}`,
      durationMinutes: duration,
      recurrence,
      source: 'manual',
    });
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.label}>What is it?</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Dentist appointment"
          placeholderTextColor={palette.textMuted}
          style={styles.input}
          autoFocus
        />

        <Text style={styles.label}>Which area of life?</Text>
        <View style={styles.chipRow}>
          {categoryOrder.map((c) => {
            const cat = categories[c];
            const selected = c === category;
            return (
              <Pressable
                key={c}
                onPress={() => {
                  setCategory(c);
                  setIcon(cat.icon);
                }}
                style={[styles.catChip, { borderColor: cat.color }, selected && { backgroundColor: cat.soft }]}
              >
                <Text style={styles.catIcon}>{cat.icon}</Text>
                <Text style={[styles.catLabel, { color: cat.color }]}>{cat.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Pick an icon</Text>
        <View style={styles.iconGrid}>
          {iconChoices.map((choice) => (
            <Pressable
              key={choice}
              onPress={() => setIcon(choice)}
              style={[styles.iconChip, choice === icon && styles.iconChipSelected]}
            >
              <Text style={styles.iconChipText}>{choice}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>What time?</Text>
        {Platform.OS === 'android' && !showPicker ? (
          <Pressable style={styles.timeButton} onPress={() => setShowPicker(true)}>
            <Text style={styles.timeButtonText}>
              {time.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
            </Text>
          </Pressable>
        ) : null}
        {showPicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, selected) => {
              if (Platform.OS === 'android') setShowPicker(false);
              if (selected) setTime(selected);
            }}
          />
        )}

        <Text style={styles.label}>Repeats</Text>
        <View style={styles.chipRow}>
          {recurrenceOptions.map((opt) => {
            const selected = opt.id === recurrence;
            return (
              <Pressable
                key={opt.id}
                onPress={() => setRecurrence(opt.id)}
                style={[styles.recChip, selected && styles.recChipSelected]}
              >
                <Text style={[styles.recChipText, selected && styles.recChipTextSelected]}>{opt.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={onSave}
          disabled={!canSave}
          style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
        >
          <Text style={styles.saveButtonText}>Add to my day</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.bg },
  scroll: { padding: 20, paddingBottom: 60 },
  label: { fontSize: 14, fontWeight: '800', color: palette.textMuted, marginTop: 20, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    backgroundColor: palette.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 16,
    fontSize: 17,
    fontWeight: '600',
    color: palette.text,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catChip: {
    width: '47%',
    borderWidth: 2,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    backgroundColor: palette.card,
  },
  catIcon: { fontSize: 28, marginBottom: 4 },
  catLabel: { fontSize: 14, fontWeight: '800' },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  iconChip: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: palette.border,
  },
  iconChipSelected: { borderColor: palette.text, borderWidth: 2, backgroundColor: '#fff' },
  iconChipText: { fontSize: 22 },
  timeButton: {
    backgroundColor: palette.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 16,
    alignItems: 'center',
  },
  timeButtonText: { fontSize: 20, fontWeight: '800', color: palette.text },
  recChip: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: palette.card,
  },
  recChipSelected: { backgroundColor: palette.text, borderColor: palette.text },
  recChipText: { fontSize: 14, fontWeight: '700', color: palette.text },
  recChipTextSelected: { color: '#fff' },
  saveButton: {
    marginTop: 32,
    backgroundColor: palette.text,
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
  },
  saveButtonDisabled: { opacity: 0.4 },
  saveButtonText: { color: '#fff', fontSize: 17, fontWeight: '800' },
});
