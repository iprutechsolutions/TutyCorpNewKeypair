import {StyleSheet, View} from 'react-native';
import {Theme, useTheme} from '../theme/ThemeProvider';
import LoginHeader from '../components/LoginHeader';
import React, {useContext, useEffect, useState} from 'react';
import PhoneNumberInput from '../components/PhoneNumberInput';
import PButton from '../components/PButton';
import i18n from '../../i18n';
import OTP from '../components/OTP';
import PText from '../components/PText';
import {AuthContext} from '../store/auth-context';
import {User} from '../models/User';
import {useNavigation} from '@react-navigation/native';
import sendOtp, {verifyOtp} from '../services/otpApi';
import {ResponseModel} from '../models/ResponseModel';
import {TErrorCodes} from '../utils/ErrorCodes';
import {showFailureToast, showSuccessToast} from '../components/Toast';
import {ErrorModel} from '../models/ErrorModel';
import {RouteProp, useRoute} from '@react-navigation/native';

type OTPPros = RouteProp<{OTPScreen: {isStaff: boolean}}, 'OTPScreen'>;

const OTPScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute<OTPPros>();
  const isStaff = route.params.isStaff;

  const authCtx = useContext(AuthContext);
  const [isPhoneNoEntered, setIsPhoneNoEntered] = useState(false);
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [isOtpSent, setOtpSent] = useState(false);
  const [isOtpEntered, setOtpEntered] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const [otp, setOtp] = useState('');
  const styles = generateStyles(theme);
  const [secondsRemaining, setSecondsRemaining] = useState(30);

  // Function to decrement the seconds remaining
  const decrementSeconds = () => {
    const timerID = setInterval(() => {
      if (secondsRemaining > 0) {
        setSecondsRemaining(prevSeconds => prevSeconds - 1);
      }
    }, 1000);
  };

  const sendOtpApiHandler = async () => {
    setSecondsRemaining(30);
    if (isPhoneNoEntered) {
      setIsOtpSending(true);
    }
    const response: ResponseModel = await sendOtp(phoneNumber, isStaff);
    if (response.statusCode === TErrorCodes.OTP_SENT_SUCCESSFULLY) {
      showSuccessToast(response.message);
      setOtpSent(true);
      decrementSeconds();
      setIsOtpSending(false);
    } else {
      showFailureToast(response.message);
      setIsOtpSending(false);
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <LoginHeader theme={theme} />
        <PhoneNumberInput
          theme={theme}
          placeholder={i18n.translate('enter_phone_number')}
          readOnly={isOtpSending ? true : false}
          onPhoneEntered={(phoneNumber: string) => {
            if (phoneNumber && phoneNumber.length === 10) {
              setIsPhoneNoEntered(true);
              setPhoneNumber(phoneNumber);
            } else {
              setIsPhoneNoEntered(false);
            }
          }}
        />
        {isOtpSent && (
          <>
            <OTP
              theme={theme}
              onComplete={(val: boolean, otp: string) => {
                setOtpEntered(val);
                setOtp(otp);
              }}></OTP>
            <PButton
              theme={theme}
              title={i18n.t('verify_otp')}
              style={[
                {
                  backgroundColor: isOtpEntered
                    ? theme.colors.primary
                    : theme.colors.btndisable,
                },
              ]}
              textStyle={styles.loginBtnTxt}
              onPress={async () => {
                const response: User | ErrorModel = await verifyOtp(
                  phoneNumber,
                  otp,
                  isStaff,
                );
                if ('statusCode' in response) {
                  showFailureToast(response.message);
                } else {
                  setOtpSent(true);
                  authCtx?.authenticate({...response, language: 'en'});
                  navigation.navigate('HomeScreen');
                }
              }}></PButton>
            <View style={styles.resendContainer}>
              {secondsRemaining > 0 ? (
                <PText theme={theme}>
                  Resend OTP in: {secondsRemaining} seconds
                </PText>
              ) : (
                <>
                  <PText style={styles.resendmsg} theme={theme}>
                    {i18n.t("didn't_get_otp")}
                  </PText>
                  <PText
                    onPress={sendOtpApiHandler}
                    theme={theme}
                    style={styles.resend}>
                    Resend
                  </PText>
                </>
              )}
            </View>
          </>
        )}
        {!isOtpSent && (
          <>
            <PButton
              theme={theme}
              title={i18n.t('send_otp')}
              style={[
                {
                  backgroundColor: isPhoneNoEntered
                    ? theme.colors.primary
                    : theme.colors.btndisable,
                },
              ]}
              textStyle={styles.loginBtnTxt}
              onPress={sendOtpApiHandler}></PButton>
            {isOtpSending && (
              <PText style={styles.sendingOtp} theme={theme}>
                {i18n.t('sending_otp')}
              </PText>
            )}
          </>
        )}
      </View>
    </View>
  );
};
const generateStyles = (theme: Theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      position: 'relative',
      backgroundColor: theme.colors.whitecolor,
    },
    container: {
      width: '100%',
      height: 250,
    },
    loginBtnTxt: {
      color: theme.colors.whitecolor,
      fontSize: theme.fontSizes.medium,
      fontFamily: theme.fonts.bold,
    },
    resendmsg: {
      textAlign: 'center',
    },
    sendingOtp: {
      textAlign: 'center',
    },
    resend: {
      color: theme.colors.primary,
      fontFamily: theme.fonts.bold,
      marginLeft: 5,
      textDecorationLine: 'underline',
    },
    resendContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
export default OTPScreen;
