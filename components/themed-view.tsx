import { View, ViewProps } from 'react-native';
import { Colors } from '@/constants/themes';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemedView({ style, ...props }: ViewProps) {
  const { actualTheme } = useTheme();
  const backgroundColor = Colors[actualTheme].background;

  return <View style={[{ backgroundColor }, style]} {...props} />;
}
