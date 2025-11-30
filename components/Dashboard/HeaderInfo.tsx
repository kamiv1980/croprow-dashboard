import React from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {ThemedView} from "@/components/themed-view";
import SpeedButton from "@/components/HeaderInfo/SpeedButton";
import FanButton from "@/components/HeaderInfo/FanButton";
import HooperButton from "@/components/HeaderInfo/HooperButton";
import ShaftButton from "@/components/HeaderInfo/ShaftButton";

export default function HeaderInfo(){
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

  return (
    <ThemedView style={styles.container}>
        <SpeedButton/>
        {isLandscape && (
            <>
                <FanButton/>
                <ShaftButton/>
                <HooperButton/>
            </>
        )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
});
