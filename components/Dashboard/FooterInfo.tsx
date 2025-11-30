import React from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {ThemedView} from "@/components/themed-view";
import FanButton from "@/components/HeaderInfo/FanButton";
import HooperButton from "@/components/HeaderInfo/HooperButton";
import ShaftButton from "@/components/HeaderInfo/ShaftButton";

export default function FooterInfo(){
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    if (isLandscape) return null;

  return (
    <ThemedView style={styles.container}>
        <FanButton/>
        <ShaftButton/>
        <HooperButton/>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
});
