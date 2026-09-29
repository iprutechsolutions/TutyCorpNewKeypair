import React, {useState} from 'react';
import {View, Modal, Image, Button, StyleSheet} from 'react-native';
import PText from './PText';
import theme from '../theme/theme';
import {ticketSuccess} from '../assets';
import i18n from '../../i18n';

const TicketSuccessModel = ({visible, ticketId, onClose, theme, msg}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View>
            <PText theme={theme}>{i18n.t('ticket_number')}</PText>
            <PText
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
              }}
              theme={theme}>
              {ticketId}
            </PText>
          </View>
          <Image source={ticketSuccess} style={styles.image} />
          <PText theme={theme} style={styles.msg}>
            {msg}
          </PText>
          <View style={styles.buttonContainer}>
            <PText style={styles.btnd} theme={theme} onPress={onClose}>
              {i18n.t('ok')}
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
  msg: {
    color: theme.colors.textcolor,
    fontFamily: theme.fonts.regular,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    textAlign: 'center',
    marginBottom: 10,
  },
  btnd: {
    backgroundColor: theme.colors.primary,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 5,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',

    color: theme.colors.whitecolor,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    margin: 20,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
    marginTop: 20,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '60%',
  },
});

export default TicketSuccessModel;
