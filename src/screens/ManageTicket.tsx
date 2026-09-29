import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import PText from '../components/PText';
import {Theme, useTheme} from '../theme/ThemeProvider';
import i18n from '../../i18n';
import {Picker} from '@react-native-picker/picker';
import TInput from '../components/TInput';
import AttachmentComponent from '../components/AttachmentComponent';
import {FileItem} from '../models/FileItem';
import {Complaint} from '../models/Complaint';
import {getUserFromStorage} from '../store/user';
import {User} from '../models/User';
import {updateTicket} from '../services/ticket.api';
import {TErrorCodes} from '../utils/ErrorCodes';
import {showFailureToast, showSuccessToast} from '../components/Toast';
import ViewHistoryModel from '../components/ViewHistoryModel';
import {useNavigation} from '@react-navigation/native';
import ReassignModel from '../components/ReassignModel';

const ManageTicket = ({ticket}) => {
  const theme = useTheme();
  const navigation = useNavigation();

  const styes = generateStyles(theme);
  const [user, setUser] = useState<User>();
  const [category, setCategory] = useState(ticket.STATUS);
  const [comments, setComments] = useState('');
  const [attachments, setAttachments] = useState<FileItem[]>([]);
  const [successModelVisible, setSuccessModelVisible] = useState(false);
  const [reassignModelVisible, setReassignModelVisible] = useState(false);

  const categories: string[] = ['Open', 'Ongoing', 'Closed'];

  const renderStatus = () => {
    return categories?.map(item => (
      <Picker.Item style={styles.text} key={item} label={item} value={item} />
    ));
  };

  useEffect(() => {
    (async () => {
      const user = await getUserFromStorage();

      if (user) setUser(user);
    })();
  }, []);

  const styles = generateStyles(theme);

  return (
    <View style={styes.manageContainer}>
      <PText
        style={{
          color: theme.colors.primary,
          fontFamily: theme.fonts.bold,
          marginTop: 10,
          marginLeft: 10,
        }}
        theme={theme}>
        {i18n.t('manage_ticket')}
      </PText>
      <View>
        <PText style={styles.title} theme={theme}>
          {i18n.t('ticket_status')}
        </PText>
        <Picker
          style={styles.picker}
          selectedValue={category}
          onValueChange={(itemValue: string) => {
            setCategory(itemValue);
          }}>
          {renderStatus()}
        </Picker>
      </View>
      <View>
        <PText style={styles.title} theme={theme}>
          {i18n.t('comments')}
        </PText>
        <TInput
          style={styles.comments}
          maxLength={200}
          numberOfLines={1}
          placeholder={i18n.t('enter_comments')}
          onChangeText={(text: string) => {
            setComments(text);
          }}
          value={comments}
          theme={theme}></TInput>
      </View>
      <View>
        <AttachmentComponent
          maxAllowed={1}
          theme={theme}
          files={attachments}></AttachmentComponent>
      </View>
      <View>
        <PText
          theme={theme}
          style={styles.saveBtn}
          onPress={async () => {
            const request = {
              ticket_id: ticket.ticket_id,
              status: category,
              shelf: ticket.shelf,
              REMARKOFONGOING: comments,
              DEPTIDOFACCEPT: ticket.DEPT_NAME,
              NAMEOFACCEPT: user?.ID,
            };
            const response = await updateTicket(request, attachments);
            if (
              response?.statusCode === TErrorCodes.TICKET_UPDATED_SUCCESSFULLY
            ) {
              showSuccessToast(response.message);
              navigation.navigate('HomeScreen');
            } else if (
              response?.statusCode === TErrorCodes.TICKET_UPDATED_FAILED
            ) {
              showFailureToast(response.message);
            }
          }}>
          {i18n.t('submit')}
        </PText>
      </View>
      <View style={styes.row}>
        <PText
          theme={theme}
          onPress={async () => {
            setSuccessModelVisible(true);
          }}>
          {i18n.t('viewhistory')}
        </PText>
        <PText theme={theme}>|</PText>
        <PText
          theme={theme}
          onPress={async () => {
            setReassignModelVisible(true);
          }}>
          {i18n.t('reassign')}
        </PText>
      </View>
      <ViewHistoryModel
        visible={successModelVisible}
        ticketId={ticket.ticket_id}
        onClose={() => {
          setSuccessModelVisible(false);
        }}
        theme={theme}></ViewHistoryModel>
      <ReassignModel
        visible={reassignModelVisible}
        ticket={ticket}
        onClose={() => {
          setReassignModelVisible(false);
        }}
        theme={theme}></ReassignModel>
    </View>
  );
};
const generateStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 40,
    },

    manageContainer: {
      backgroundColor: theme.colors.whitecolor,
      borderRadius: 8,
      marginLeft: 10,
      marginRight: 10,
      marginTop: 10,
      marginBottom: '5%',
    },
    text: {
      color: theme.colors.primary,
    },
    picker: {
      borderRadius: 8,
    },
    title: {
      color: theme.colors.gray,
      fontSize: 16,
      marginLeft: 10,
    },
    comments: {
      backgroundColor: theme.colors.whitecolor,
      borderRadius: 5,
      paddingLeft: 10,
      paddingRight: 10,
      color: theme.colors.gray,
    },
    saveBtn: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.whitecolor,
      textAlign: 'center',
      marginLeft: '20%',
      marginRight: '20%',
      marginTop: '10%',
      marginBottom: '10%',
      paddingTop: 10,
      paddingBottom: 10,
      borderRadius: 5,
    },
  });
export default ManageTicket;
