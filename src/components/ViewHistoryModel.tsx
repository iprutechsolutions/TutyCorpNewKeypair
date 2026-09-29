import React, {useEffect, useState} from 'react';
import {View, Modal, Image, Button, StyleSheet, FlatList} from 'react-native';
import PText from './PText';
import theme from '../theme/theme';
import {ticketSuccess} from '../assets';
import i18n from '../../i18n';
import {getTicketHistory} from '../services/ticket.api';
import {ComplaintHistory} from '../models/ComplaintHistoryModel';

const ViewHistoryModel = ({visible, ticketId, onClose, theme}) => {
  const [history, setHistory] = useState<ComplaintHistory[]>();
  useEffect(() => {
    (async () => {
      const response = await getTicketHistory(ticketId);
      if ('statusCode' in response && 'message' in response) {
      } else {
        setHistory(response);
      }
    })();
  }, [visible]);

  const ItemSeparator = () => <View style={styles.separator} />;

  const renderItem = ({item}) => {
    const dateObject = new Date(item.date_created);

    // Get the date
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1; // Month starts from 0, so add 1
    const day = dateObject.getDate();

    // Get the time
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();
    const seconds = dateObject.getSeconds();
    const timeFormatted = dateObject.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: theme.colors.whiteColor,
          gap: 10,
        }}>
        <View style={{width: '70%'}}>
          <PText theme={theme}>#{item.ticket_id}</PText>
          <PText theme={theme}>{item.remark?.trim()}</PText>
          <PText theme={theme}>{item.emp_name}</PText>
        </View>
        <View>
          <PText theme={theme}>{`${day}/${month}/${year}`}</PText>
          <PText theme={theme}>{timeFormatted}</PText>
        </View>
      </View>
    );
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
        <View
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0)',
            padding: 20,
            borderRadius: 10,
            width: '99%',
          }}>
          <PText
            theme={theme}
            style={{
              fontSize: 20,
              backgroundColor: theme.colors.primary,
              color: theme.colors.whitecolor,
              padding: 10,
              textAlign: 'center',
            }}>
            {i18n.t('viewhistory')}
          </PText>
          <View style={styles.listContainer}>
            {history && history?.length > 0 && (
              <FlatList
                data={history}
                renderItem={renderItem}
                keyExtractor={item => item.date_created.toString()}
                ItemSeparatorComponent={ItemSeparator}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
          <View style={styles.buttonContainer}>
            <PText style={styles.btnd} theme={theme} onPress={onClose}>
              {i18n.t('back')}
            </PText>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: theme.colors.gray,
  },
  listContainer: {
    height: '70%',
    width: '100%',
    paddingRight: '5%',
    paddingLeft: '5%',
    justifyContent: 'center',
    paddingTop: 10,
    backgroundColor: theme.colors.whitecolor,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  headerContainer: {
    backgroundColor: 'red',
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingLeft: 10,
    width: '100%',
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 5,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10,
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
    backgroundColor: theme.colors.whitecolor,
    borderRadius: 10,
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
    width: '100%',
    backgroundColor: theme.colors.whitecolor,
    paddingBottom: 10,
  },
});

export default ViewHistoryModel;
