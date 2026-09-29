import React, {useState} from 'react';
import {View, Modal, Image, Button, StyleSheet} from 'react-native';
import PText from './PText';
import theme from '../theme/theme';
import i18n from '../../i18n';

const LogoutModel = ({visible, onClose, onLogout, theme}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View>
            <PText style={styles.confirmation} theme={theme}>
              {i18n.t('confirmation')}
            </PText>
          </View>
          <PText theme={theme} style={styles.msg}>
            {i18n.t('logout_msg')}
          </PText>
          <View style={styles.buttonContainer}>
            <PText style={styles.btn} theme={theme} onPress={onClose}>
              {i18n.t('no')}
            </PText>
            <PText style={styles.btnd} theme={theme} onPress={onLogout}>
              {i18n.t('yes')}
            </PText>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  confirmation: {
    fontSize: theme.fontSizes.thick,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    paddingBottom: 20,
  },
  btn: {
    backgroundColor: theme.colors.gray,
    paddingLeft: '20%',
    paddingRight: '20%',
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 5,
    textAlign: 'center',
    color: theme.colors.whitecolor,
  },
  btnd: {
    backgroundColor: theme.colors.primary,
    paddingLeft: '20%',
    paddingRight: '20%',
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 5,
    textAlign: 'center',
    color: theme.colors.whitecolor,
  },
  msg: {
    color: theme.colors.textcolor,
    fontFamily: theme.fonts.regular,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    textAlign: 'center',
    marginBottom: 30,
  },

  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    margin: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    width: '60%',
    gap: 30,
  },
});

export default LogoutModel;
