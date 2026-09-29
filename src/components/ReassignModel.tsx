import React, {useEffect, useState} from 'react';
import {View, Modal, Image, Button, StyleSheet, FlatList} from 'react-native';
import PText from './PText';
import theme from '../theme/theme';
import i18n from '../../i18n';
import {getDepartments} from '../services/department.api';
import {getListOfCategories} from '../services/category.api';
import {Department} from '../models/Department';
import {Category} from '../models/Category';
import {Picker} from '@react-native-picker/picker';
import {Zone} from '../models/Zone';
import {reassignTicket} from '../services/ticket.api';
import {TErrorCodes} from '../utils/ErrorCodes';
import {showFailureToast} from './Toast';
import TicketSuccessModel from './TicketSuccess';

const ReassignModel = ({visible, ticket, onClose, theme}) => {
  const [departments, setDepartments] = useState<Department[] | undefined>();
  const [categories, setCategories] = useState<Category[]>();
  const [selectCategory, setSelectCategory] = useState<Category | null>(null);
  const [selectDepartment, setSelectDepartment] = useState<Department | null>({
    id: parseInt(ticket.DEPT_NAME),
    name: ticket.name,
  } as Department);

  const [reassignSuccessModelVisible, setReassignSuccessModelVisible] =
    useState(false);

  useEffect(() => {
    (async () => {
      const response = await getDepartments();
      if ('statusCode' in response) {
      } else {
        setDepartments(response);
        if (response.length > 0) {
          setSelectDepartment(response[0]);
        }
      }
    })();
  }, []);
  useEffect(() => {
    (async () => {
      const response = await getListOfCategories();
      if ('statusCode' in response) {
      } else {
        setCategories(
          response.filter(item => item.department_id === selectDepartment?.id),
        );
        if (response.length > 0) {
          setSelectCategory(response[0]);
        }
      }
    })();
  }, [selectDepartment]);

  const renderDepartItems = () => {
    return departments?.map(item => (
      <Picker.Item
        style={styles.text}
        key={item.toString()}
        label={item.name}
        value={item}
      />
    ));
  };
  const renderCategorytItems = () => {
    return categories?.map(item => (
      <Picker.Item
        style={styles.text}
        key={item.toString()}
        label={item.complaint_cat_name}
        value={item}
      />
    ));
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
            {i18n.t('reassign')}
          </PText>
          <View style={styles.listContainer}>
            <View style={{margin: 10}}>
              <PText theme={theme} style={{marginBottom: 10}}>
                {i18n.t('streetname')}
              </PText>
              <PText
                theme={theme}
                style={{
                  marginBottom: 10,
                  color: theme.colors.primary,
                  paddingLeft: 10,
                  width: '95%',
                }}>
                {ticket.ASSN_STREET}
              </PText>
              <PText theme={theme} style={{marginBottom: 10, width: '95%'}}>
                {i18n.t('wardno')}
              </PText>
              <PText
                theme={theme}
                style={{
                  marginBottom: 10,
                  color: theme.colors.primary,
                  paddingLeft: 10,
                  width: '95%',
                }}>
                {ticket.ward_name}
              </PText>
              <PText theme={theme}> {i18n.t('zone')}</PText>
              <PText
                style={{
                  marginBottom: 10,
                  color: theme.colors.primary,
                  paddingLeft: 10,
                  width: '95%',
                }}
                theme={theme}>
                {ticket.zone_name}
              </PText>
              <PText theme={theme}> {i18n.t('department')}</PText>
              <Picker
                style={styles.picker}
                selectedValue={selectDepartment!}
                onValueChange={(itemValue: Zone) => {
                  setSelectDepartment(itemValue);
                }}>
                {renderDepartItems()}
              </Picker>
              <PText theme={theme}>
                {i18n.t('complaint')} {i18n.t('category')}
              </PText>
              <Picker
                style={styles.picker}
                selectedValue={selectCategory!}
                onValueChange={(itemValue: Category) => {
                  setSelectCategory(itemValue);
                }}>
                {renderCategorytItems()}
              </Picker>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <PText
              style={styles.btnd}
              theme={theme}
              onPress={async () => {
                onClose();
              }}>
              {i18n.t('back')}
            </PText>
            <PText
              style={styles.btnd}
              theme={theme}
              onPress={async () => {
                const request = {
                  ticket_id: ticket.ticket_id,
                  ASSN_ZONE: ticket.ASSN_ZONE,
                  ASSN_WARD: ticket.ASSN_WARD,
                  ASSN_STREET: ticket.ASSN_STREET,
                  DEPT_NAME: ticket.DEPT_NAME,
                  PRE_DEPT_NAME: ticket.PRE_DEPT_NAME,
                  DEPT_CAT: ticket.DEPT_CAT,
                  PRE_DEPT_CAT: ticket.PRE_DEPT_CAT,
                  PRE_ASSIGN_PERSON: ticket.PRE_ASSIGN_PERSON,
                  ASSIGN_PERSON: ticket.ASSIGN_PERSON,
                  REPORT: ticket.REPORT,
                  SLA: ticket.SLA,
                  PRE_REPORT: ticket.PRE_REPORT,
                };
                const response = await reassignTicket(request);
                if (
                  response.statusCode === TErrorCodes.TICKET_REASSIGN_FAILED
                ) {
                  showFailureToast(response.message);
                } else {
                  setReassignSuccessModelVisible(false);
                }
                onClose();
              }}>
              {i18n.t('submit')}
            </PText>
          </View>
        </View>
        <TicketSuccessModel
          visible={reassignSuccessModelVisible}
          ticketId={ticket?.ticket_id}
          msg={i18n.t('reassign_success')}
          onClose={() => {
            setReassignSuccessModelVisible(false);
          }}
          theme={theme}></TicketSuccessModel>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  separator: {
    height: 0.5,
    backgroundColor: 'gray',
  },
  picker: {
    borderRadius: 8,
  },
  listContainer: {
    height: '70%',
    backgroundColor: theme.colors.whitecolor,
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
  text: {
    color: theme.colors.primary,
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
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    backgroundColor: theme.colors.whitecolor,
    paddingBottom: 10,
  },
});

export default ReassignModel;
