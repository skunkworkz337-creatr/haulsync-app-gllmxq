
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Platform } from 'react-native';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { Stack } from 'expo-router';
import React from 'react';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  if (Platform.OS === 'ios') {
    const tabs: TabBarItem[] = [
      {
        route: '/(tabs)/(home)',
        label: 'Home',
        icon: 'house.fill',
      },
      {
        route: '/(tabs)/profile',
        label: 'Profile',
        icon: 'person.fill',
      },
    ];

    return (
      <>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(home)" />
          <Stack.Screen name="profile" />
        </Stack>
        <FloatingTabBar tabs={tabs} />
      </>
    );
  }

  return (
    <NativeTabs>
      <NativeTabs.Screen
        name="(home)"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon name="house.fill" color={color} size={size} />
          ),
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.text,
        }}
      />
      <NativeTabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Icon name="person.fill" color={color} size={size} />
          ),
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.text,
        }}
      />
    </NativeTabs>
  );
}
