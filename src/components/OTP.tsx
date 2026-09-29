import React, {useEffect, useImperativeHandle, useRef, useState} from 'react';
import {Theme} from '../theme/ThemeProvider';
import {Keyboard, StyleSheet, TextInput, View} from 'react-native';
import PText from './PText';
import PInput from './PInput';
import i18n from '../../i18n';
type OTPProps = {
  theme: Theme;
  onComplete: (val: boolean, otpValue: string) => void;
};
const OTP: React.FC<OTPProps> = ({theme, onComplete}) => {
  const styles = generateStyles(theme);
  const inputRef1 = useRef<TextInput>(null);
  const inputRef2 = useRef<TextInput>(null);
  const inputRef3 = useRef<TextInput>(null);
  const inputRef4 = useRef<TextInput>(null);
  const inputRef5 = useRef<TextInput>(null);
  const inputRef6 = useRef<TextInput>(null);

  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);

  useEffect(() => {
    if (
      otpValues[0] !== '' &&
      otpValues[1] !== '' &&
      otpValues[2] !== '' &&
      otpValues[3] !== '' &&
      otpValues[4] !== '' &&
      otpValues[5] !== ''
    ) {
      onComplete(true, otpValues.join(''));
    }
  }, [otpValues]);

  const handleTextChange = (text: string, index: number, inputRef: any) => {
    if (text.length === 1 && inputRef?.current) {
      inputRef.current.focus();
      const updatedOtpValues = [...otpValues];
      updatedOtpValues[index] = text;
      setOtpValues(updatedOtpValues);
    } else {
      const updatedOtpValues = [...otpValues];
      updatedOtpValues[index] = text;
      setOtpValues(updatedOtpValues);
      Keyboard.dismiss();
    }
  };
  useEffect(() => {
    if (inputRef1.current) {
      inputRef1.current.focus();
    }
  }, []);

  return (
    <View style={styles.root}>
      <PText style={styles.title} theme={theme}>
        {i18n.t('otp_message')}
      </PText>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <PInput
            ref={inputRef1}
            theme={theme}
            onChangeText={text => handleTextChange(text, 0, inputRef2)}
          />
          <PInput
            theme={theme}
            ref={inputRef2}
            onChangeText={text => handleTextChange(text, 1, inputRef3)}
          />
          <PInput
            theme={theme}
            ref={inputRef3}
            onChangeText={text => handleTextChange(text, 2, inputRef4)}
          />
          <PInput
            theme={theme}
            ref={inputRef4}
            onChangeText={text => handleTextChange(text, 3, inputRef5)}
          />
          <PInput
            theme={theme}
            ref={inputRef5}
            onChangeText={text => handleTextChange(text, 4, inputRef6)}
          />
          <PInput
            theme={theme}
            ref={inputRef6}
            onChangeText={text => handleTextChange(text, 5, null)}
          />
        </View>
      </View>
    </View>
  );
};
const generateStyles = (theme: Theme) =>
  StyleSheet.create({
    root: {
      height: '30%',
      marginTop: 10,
      marginBottom: '8%',
    },
    title: {
      textAlign: 'center',
      fontSize: theme.fontSizes.xthin,
      marginBottom: 5,
    },
    container: {
      width: '100%',
      height: '60%',
    },
    inputContainer: {
      width: '80%',
      height: '100%',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    inputView: {
      width: '80%',
      height: '100%',
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: 'row',
      borderColor: theme.colors.textcolor,
    },
    input: {
      width: 10,
      height: '100%',
    },
  });
export default OTP;
