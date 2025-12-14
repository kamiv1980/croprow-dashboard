import React from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {ThemedView} from "@/components/themed-view";
import FanButton from "@/components/Dashboard/FanButton";
import HooperButton from "@/components/Dashboard/HooperButton";
import ShaftButton from "@/components/Dashboard/ShaftButton";
import {Carousel} from "@/components/Dashboard/Carousel";

export default function FooterInfo(){
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    if (isLandscape) return null;

  return (
    <ThemedView style={styles.container}>
        <Carousel>
            <FanButton/>
            <ShaftButton/>
            <HooperButton/>
            <FanButton/>
            <ShaftButton/>
            <HooperButton/>
            <FanButton/>
            <ShaftButton/>
            <HooperButton/>
        </Carousel>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
});
