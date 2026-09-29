import {StyleSheet, View} from 'react-native';
import {Theme} from '../theme/ThemeProvider';
import PText from './PText';
import React, {useState} from 'react';
import {Input} from 'react-native-elements';
import i18n from '../../i18n';
type PhoneNumberInputProps = {
  theme: Theme;
  onPhoneEntered: (val: string) => void;
  readOnly?: boolean;
  placeholder?: string;
};
const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  theme,
  onPhoneEntered,
  readOnly,
  placeholder,
}) => {
  const [phoneNoEntered, setPhoneNoEntered] = useState(false);
  const styles = generateStyles(theme);
  return (
    <View style={styles.root}>
      <PText style={styles.title} theme={theme}>
        {!phoneNoEntered ? i18n.t('enter_phone') : i18n.t('mobile_number')}
      </PText>
      <View style={styles.inputContainer}>
        <View style={styles.inputView}>
          <PText style={styles.countryCode} theme={theme}>
            +91
          </PText>
          <View style={styles.divider}></View>
          <Input
            style={styles.input}
            readOnly={readOnly}
            placeholder={placeholder}
            keyboardType="phone-pad"
            inputContainerStyle={{
              borderBottomWidth: 0,
            }}
            onChangeText={(phoneNumber: string) => {
              onPhoneEntered(phoneNumber);
              if (phoneNumber && phoneNumber.length === 10) {
                setPhoneNoEntered(true);
              } else {
                setPhoneNoEntered(false);
              }
            }}
            maxLength={10}></Input>
        </View>
      </View>
    </View>
  );
};
const generateStyles = (theme: Theme) =>
  StyleSheet.create({
    root: {
      height: '40%',
    },
    title: {
      textAlign: 'center',
      marginTop: '2%',
    },
    inputContainer: {
      width: '100%',
      height: '50%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputView: {
      width: '80%',
      height: '100%',
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: 'row',
      borderColor: theme.colors.textcolor,
    },
    countryCode: {
      alignSelf: 'flex-start',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      marginTop: 10,
      marginLeft: 5,
      marginRight: 5,
      padding: 5,
    },
    divider: {
      height: '85%',
      marginTop: 3,
      width: 1,
      backgroundColor: theme.colors.textcolor,
    },
    input: {
      marginTop: 2,
      width: 1,
      backgroundColor: theme.colors.transparent,
      maxWidth: '83%',
    },
  });
export default PhoneNumberInput;
