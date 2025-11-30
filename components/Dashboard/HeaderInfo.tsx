import React from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {ThemedView} from "@/components/themed-view";
import SpeedButton from "@/components/Dashboard/SpeedButton";
import FanButton from "@/components/Dashboard/FanButton";
import HooperButton from "@/components/Dashboard/HooperButton";
import ShaftButton from "@/components/Dashboard/ShaftButton";

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
