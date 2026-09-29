import React from 'react';
import {forwardRef, useImperativeHandle, useRef} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {Input, InputProps} from 'react-native-elements';
import {Theme} from '../theme/ThemeProvider';
interface PInputProps extends InputProps {
  theme: Theme;
}

const PInput: React.FC<PInputProps> = forwardRef(function PInput(props, ref) {
  const inputRef = useRef<TextInput>(null);

  useImperativeHandle(
    ref,
    () => {
      return {
        focus() {
          inputRef?.current?.focus();
          inputRef?.current?.clear();
        },
      };
    },
    [],
  );
  const {theme} = props;
  const styles = generateStyles(theme);
  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputView}>
        <Input
          ref={inputRef}
          style={styles.input}
          {...props}
          keyboardType="phone-pad"
          inputContainerStyle={{
            borderBottomWidth: 0,
          }}
          maxLength={1}></Input>
      </View>
    </View>
  );
});

const generateStyles = (theme: Theme) =>
  StyleSheet.create({
    title: {
      textAlign: 'center',
    },
    inputContainer: {
      width: '15%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputView: {
      width: '100%',
      height: '100%',
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: 'row',
      borderColor: theme.colors.primary,
    },
    input: {
      textAlign: 'center',
      color: theme.colors.textcolor,
    },
  });

export default PInput;
