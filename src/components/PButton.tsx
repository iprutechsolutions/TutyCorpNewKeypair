import React from 'react';
import {StyleSheet, TextStyle, TouchableOpacity, ViewStyle} from 'react-native';
import PText from './PText';
import {Theme} from '../theme/ThemeProvider';
import {ButtonProps} from 'react-native-elements';

interface MyBtnProps extends ButtonProps {
  theme: Theme;
  title: string;
  textStyle: TextStyle;
  onPress: () => void;
}
const PButton: React.FC<MyBtnProps> = ({
  theme,
  title,
  onPress,
  style,
  textStyle,
  ...rest
}) => {
  const styles = generateStyles(theme);

  return (
    <TouchableOpacity style={[styles.btn, style]} onPress={onPress}>
      <PText theme={theme} style={[styles.btnTxt, textStyle]} {...rest}>
        {title}
      </PText>
    </TouchableOpacity>
  );
};
const generateStyles = (theme: Theme) =>
  StyleSheet.create({
    btn: {
      marginTop: '2%',
      borderRadius: 8,
      width: '80%',
      height: '20%',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      backgroundColor: theme.colors.primary,
      color: theme.colors.whitecolor,
    },
    btnTxt: {
      width: '100%',
      height: '100%',
      textAlign: 'center',
      textAlignVertical: 'center',
      color: theme.colors.whitecolor,
    },
  });
export default PButton;
