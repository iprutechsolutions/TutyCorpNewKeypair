import React from 'react';
import {useRef} from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {Input, InputProps} from 'react-native-elements';
import {Theme} from '../theme/ThemeProvider';

interface TInputProps extends InputProps {
  theme: Theme;
}

const TInput: React.FC<TInputProps> = props => {
  const inputRef = useRef<TextInput>(null);
  const {theme} = props;
  const styles = generateStyles(theme);
  return (
    <>
      <Input
        ref={inputRef}
        style={styles.input}
        {...props}
        placeholderTextColor={theme.colors.gray}
        inputContainerStyle={{
          borderBottomWidth: 0,
        }}></Input>
    </>
  );
};

const generateStyles = (theme: Theme) =>
  StyleSheet.create({
    title: {
      textAlign: 'center',
    },

    input: {
      textAlign: 'center',
      color: theme.colors.textcolor,
    },
  });

export default TInput;
