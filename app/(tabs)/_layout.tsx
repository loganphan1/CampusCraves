import { Stack } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen 
        name = "(auth)/sign-in"
        options= {{
          title: 'Sign In'
        }}
      />
      <Stack.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Stack.Screen
        name="explore"
        options={{
          title: 'Explore',
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
