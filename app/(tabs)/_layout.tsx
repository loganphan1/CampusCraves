import { Stack } from 'expo-router';
import React from 'react';
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';

export default function TabLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="home"
        options={{
          title: 'Home',
        }}
      />
      <Stack.Screen
        name="calculate"
        options={{
          title: 'Calculate',
        }}
      />
            <Stack.Screen
        name="restaurant"
        options={{
          title: 'RESTAURANTS',
        }}
      />
    </Stack>
  );
}
