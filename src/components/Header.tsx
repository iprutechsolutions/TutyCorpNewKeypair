import React from 'react';
import {View} from 'react-native';
import PText from './PText';
import {Theme} from '../theme/ThemeProvider';

interface HeaderProps {
  theme: Theme;
}

const Header: React.FC<HeaderProps> = ({theme}) => {
  return (
    <View>
      <PText theme={theme}> Hellow World</PText>
    </View>
  );
};

export default Header;
