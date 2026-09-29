import React from 'react';
import {Text, StyleSheet, TextProps} from 'react-native';
import {Theme} from '../theme/ThemeProvider';

interface MyTextProps extends TextProps {
  children: React.ReactNode;
  theme: Theme;
}

const PText: React.FC<MyTextProps> = ({children, style, theme, ...rest}) => {
  const styles = generateStyle(theme);
  return (
    <Text style={[styles.text, style]} {...rest}>
      {children}
    </Text>
  );
};

const generateStyle = (theme: Theme) =>
  StyleSheet.create({
    text: {
      fontFamily: theme.fonts.regular,
      fontSize: theme.fontSizes.medium,
      color: theme.colors.textcolor,
    },
  });

export default PText;
