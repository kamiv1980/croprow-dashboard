import React from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {ThemedView} from "@/components/themed-view";
import SpeedButton from "@/components/Dashboard/SpeedButton";
import FanButton from "@/components/Dashboard/FanButton";
import HooperButton from "@/components/Dashboard/HooperButton";
import ShaftButton from "@/components/Dashboard/ShaftButton";
import {Carousel} from "@/components/Dashboard/Carousel";

export default function HeaderInfo(){
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

  return (
    <ThemedView style={styles.container}>
        {!isLandscape && <SpeedButton/>}
        {isLandscape && (
            <Carousel>
                <SpeedButton/>
                <FanButton/>
                <ShaftButton/>
                <HooperButton/>
                <FanButton/>
                <ShaftButton/>
                <HooperButton/>
                <HooperButton/>
            </Carousel>
        )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 22, paddingBottom: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
});
