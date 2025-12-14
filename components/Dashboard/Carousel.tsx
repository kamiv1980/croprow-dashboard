import React, { useState } from 'react';
import {
    View,
    ScrollView,
    useWindowDimensions,
    NativeSyntheticEvent,
    NativeScrollEvent,
    StyleSheet,
} from 'react-native';
import {useTheme} from "@/contexts/ThemeContext";
import {Colors} from "@/constants/themes";

type Props = {
    children: React.ReactNode;
    spacing?: number;
};

export const Carousel = ({
                                          children,
                                          spacing = 12,
                                      }: Props) => {
    const { width } = useWindowDimensions();
    const [contentWidth, setContentWidth] = useState(0);
    const [page, setPage] = useState(0);
    const { actualTheme } = useTheme();
    const { text, icon } = Colors[actualTheme];


    const isScrollable = contentWidth > width;
    const pageCount = Math.ceil(contentWidth / width);

    const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const x = e.nativeEvent.contentOffset.x;
        setPage(Math.round(x / width));
    };

    return (
        <View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                scrollEnabled={isScrollable}
                onMomentumScrollEnd={onScrollEnd}
                contentContainerStyle={{
                    alignItems: 'center',
                }}
                onContentSizeChange={(w) => setContentWidth(w)}
            >
                {React.Children.map(children, (child, i) => (
                    <View style={{ marginRight: spacing }} key={i}>
                        {child}
                    </View>
                ))}
            </ScrollView>

            {isScrollable && (
                <View style={styles.dots}>
                    {Array.from({ length: pageCount }).map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.dot,
                                {backgroundColor: icon},
                                i === page && {backgroundColor: text},
                            ]}
                        />
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    dots: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 12,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
});
