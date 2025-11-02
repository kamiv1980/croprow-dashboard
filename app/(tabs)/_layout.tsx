import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import {useTheme} from "@/contexts/ThemeContext";
import {Colors} from "@/constants/themes";
import {useTranslation} from "react-i18next";

export default function TabLayout() {
    const { actualTheme } = useTheme();
    const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[actualTheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {backgroundColor: Colors[actualTheme].background},
        sceneStyle: {backgroundColor: Colors[actualTheme].background},
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t("home.title"),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />

       <Tabs.Screen
        name="settings"
        options={{
            title: t('settings.title'),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gear" color={color} />,
        }}
      />
    </Tabs>
  );
}
