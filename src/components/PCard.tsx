import React from 'react';
import {TouchableOpacity, View, Image, StyleSheet} from 'react-native';
import PText from './PText';
import {Theme} from '../theme/ThemeProvider';

interface PCardProps {
  theme: Theme;
  title: string;
  count: string;
  color: string;
  backgroundColor: string;
  onSelect: () => void;
}

const PCard: React.FC<PCardProps> = ({
  theme,
  onSelect,
  title,
  color,
  count,
  backgroundColor,
}) => {
  const styles = generateStyles(theme);
  const updatedCount = parseInt(count) < 10 ? '0' + count : count;

  return (
    <TouchableOpacity onPress={onSelect}>
      <View style={[styles.container, {backgroundColor: backgroundColor}]}>
        <PText style={[styles.count, {color: color}]} theme={theme}>
          {updatedCount}
        </PText>
        <PText
          style={[
            styles.title,
            {
              color:
                color !== theme.colors.whitecolor
                  ? theme.colors.primary
                  : color,
            },
          ]}
          theme={theme}>
          {title}
        </PText>
      </View>
    </TouchableOpacity>
  );
};
const generateStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.cream,
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 2,
      paddingLeft: 10,
      paddingRight: 10,
      borderRadius: 10,
      width: 170,
      height: 90,
    },
    title: {
      textAlign: 'left',
      color: theme.colors.primary,
      fontSize: theme.fontSizes.medium,
      fontFamily: theme.fonts.regular,
    },
    count: {
      fontSize: 32,
      textAlign: 'center',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      fontFamily: theme.fonts.regular,
    },
    icon: {
      width: 20,
      height: 20,
    },
  });
export default PCard;
