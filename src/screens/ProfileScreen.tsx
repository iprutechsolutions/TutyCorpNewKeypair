import React, {useContext, useEffect, useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {Theme, useTheme} from '../theme/ThemeProvider';
import PText from '../components/PText';
import TInput from '../components/TInput';
import i18n from '../../i18n';
import {getUserFromStorage} from '../store/user';
import {User} from '../models/User';
import {updateUser} from '../services/user.api';
import {TErrorCodes} from '../utils/ErrorCodes';
import {
  showFailureToast,
  showInfoToast,
  showSuccessToast,
} from '../components/Toast';
import {AuthContext} from '../store/auth-context';

const ProfileScreen = () => {
  const theme = useTheme();
  const authCtx = useContext(AuthContext);
  const styles = genereateStyles(theme);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState<User>();
  const [sending, setSending] = useState(false);
  useEffect(() => {
    (async () => {
      const response = await getUserFromStorage();
      if (response) {
        setUser(response);
        setName(response.username);
        setEmail(response.email);
      }
    })();
  }, []);

  const validateEmail = email => {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <>
      <StatusBar
        backgroundColor={theme.colors.primary}
        barStyle="light-content"
      />
      <View style={styles.container}>
        <PText style={styles.personalTitle} theme={theme}>
          {i18n.t('personal_details')}
        </PText>
        <PText style={styles.phonenumber} theme={theme}>
          {i18n.t('fullname')}
        </PText>
        <TInput
          maxLength={30}
          placeholder={`${i18n.t('enter')}${i18n.t('fullname')}`}
          style={styles.phonenumberInput}
          value={name}
          disabled={user?.isStaff}
          onChangeText={(text: string) => {
            setName(text);
          }}
          theme={theme}></TInput>
        <PText style={styles.phonenumber} theme={theme}>
          {i18n.t('phonenumber')}
        </PText>
        <TInput
          editable={false}
          maxLength={10}
          placeholder={`${i18n.t('enter')}${i18n.t('phonenumber')}`}
          value={user?.phone}
          disabled={user?.isStaff}
          style={styles.phonenumberInput}
          theme={theme}></TInput>

        <PText style={styles.email} theme={theme}>
          {i18n.t('email')}
        </PText>
        <TInput
          style={styles.emailInput}
          maxLength={50}
          placeholder={`${i18n.t('enter')}${i18n.t('email')}`}
          disabled={user?.isStaff}
          onChangeText={(text: string) => {
            setEmail(text);
          }}
          value={email}
          theme={theme}></TInput>
        {!user?.isStaff && (
          <PText
            style={styles.saveBtn}
            onPress={async () => {
              if (!sending) {
                setSending(true);
                const emailCheck =
                  email.length > 0 ? validateEmail(email) : true;
                if (name.length <= 0) {
                  showFailureToast(i18n.t('fullname_required'));
                  setSending(false);
                  return;
                }

                if (emailCheck) {
                  const response = await updateUser(email, name, authCtx);
                  if (
                    response.statusCode === TErrorCodes.PROFILE_UPDATE_SUCCESS
                  ) {
                    showSuccessToast(response.message);
                  } else {
                    showFailureToast(response.message);
                  }
                  setSending(false);
                } else {
                  setSending(false);
                  showFailureToast(i18n.t('invalid_email_format'));
                }
              } else {
                showInfoToast(i18n.t('requst_in_process'));
              }
            }}
            theme={theme}>
            {sending ? i18n.t('saving') : i18n.t('save')}
          </PText>
        )}
      </View>
    </>
  );
};
const genereateStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 10,
      paddingBottom: 20,
      backgroundColor: theme.colors.whitecolor,
    },
    saveBtn: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.whitecolor,
      textAlign: 'center',
      marginLeft: '20%',
      marginRight: '20%',
      paddingTop: 10,
      paddingBottom: 10,
      borderRadius: 5,
    },
    personalTitle: {
      color: theme.colors.primary,
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'left',
      marginBottom: 15,
    },
    email: {},
    emailInput: {
      backgroundColor: theme.colors.cream,
      borderRadius: 5,
      paddingLeft: 10,
      paddingRight: 10,
      color: theme.colors.gray,
    },
    phonenumber: {},
    phonenumberInput: {
      backgroundColor: theme.colors.cream,
      borderRadius: 5,
      paddingLeft: 10,
      paddingRight: 10,
      color: theme.colors.gray,
    },
  });

export default ProfileScreen;
