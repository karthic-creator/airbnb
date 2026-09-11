import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ItemsProvider } from '@/store';
import { palette } from '@/theme';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ItemsProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: palette.bg } }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="boards/[category]" options={{ headerShown: true, title: '' }} />
            <Stack.Screen name="add" options={{ presentation: 'modal', headerShown: true, title: 'Add to your day' }} />
          </Stack>
        </ItemsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
