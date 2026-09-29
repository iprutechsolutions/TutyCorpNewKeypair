import {Button, ScrollView, StyleSheet, View} from 'react-native';
import PText from '../components/PText';
import withStreetWardAndZones from '../components/withStreetWardZone';
import React, {useEffect, useState} from 'react';
import {Theme} from '../theme/ThemeProvider';
import {Street} from '../models/Street';
import {Ward} from '../models/Ward';
import {Zone} from '../models/Zone';
import {useNavigation} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import {getWardsByStreetId} from '../services/wards.api';
import {getZonesByWardId} from '../services/zones.api';
import PInput from '../components/PInput';
import TInput from '../components/TInput';
import {Department} from '../models/Department';
import {getDepartments} from '../services/department.api';
import {Category} from '../models/Category';
import {getListOfCategories} from '../services/category.api';
import {attachmentImg, homeImg} from '../assets';
import {Image} from 'react-native-elements';
import AttachmentComponent from '../components/AttachmentComponent';
import {FileItem} from '../models/FileItem';
import {createTicket} from '../services/ticket.api';
import withGeolocation from '../components/withGeolocation';
import {Assessment} from '../models/Assessment';
import {SelectedAssessmentDetails} from '../models/SelectedAssessmentDetails';
import TicketSuccessModel from '../components/TicketSuccess';
import {TErrorCodes} from '../utils/ErrorCodes';
import {SuccessModel} from '../models/SuccessModel';
import i18n from '../../i18n';
import {getUserFromStorage} from '../store/user';
import {showFailureToast} from '../components/Toast';

interface AssessmentProps {
  assessment: Assessment;
  theme: Theme;
  streets: Street[];
  zones: Zone[];
  wards: Ward[];
  location: any;
  clearSearch: () => void;
}
const AssessmentDetailInput: React.FC<AssessmentProps> = ({
  theme,
  streets,
  zones,
  wards,
  location,
  assessment,
  clearSearch,
}) => {
  const styles = generateStyles(theme);
  const navigation = useNavigation();
  const [successModelVisible, setSuccessModelVisible] = useState(false);

  navigation.setOptions({
    tabBarVisible: true,
  });

  const [selectedAssessment, setSelectedAssessment] =
    useState<SelectedAssessmentDetails>({
      streetId: assessment ? assessment.streetNo : 0,
      streetName: assessment?.street,
      ward: {id: assessment?.wardNo, name: assessment?.ward_name},
      zone: {id: assessment?.zone, name: assessment?.zone_name},
      address: assessment ? assessment.address : '',
    });

  const [wardsList, setWards] = useState<Zone[]>(wards);
  const [departments, setDepartments] = useState<Department[] | undefined>();
  const [categories, setCategories] = useState<Category[]>();

  const [zonesList, setZones] = useState<Zone[]>(zones);
  const [selectCategory, setSelectCategory] = useState<Category | null>(null);
  const [selectDepartment, setSelectDepartment] = useState<Department | null>(
    null,
  );
  const [complaintDescription, setComplaintDescription] = useState('');

  const [fullname, setFullname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState(assessment?.address);
  const [ticketId, setTicketId] = useState('');
  let fileArray: FileItem[] = [];

  useEffect(() => {
    const updatedSearch = {
      ...selectedAssessment,
      streetId: assessment?.streetNo,
      streetName: assessment?.street,
      ward: {id: assessment?.wardNo, name: assessment?.ward_name},
      zone: {id: assessment?.zone, name: assessment?.zone_name},
    };
    setSelectedAssessment((ss: SelectedAssessmentDetails) => updatedSearch);
  }, [assessment]);

  useEffect(() => {
    (async () => {
      const user = await getUserFromStorage();
      if (user) {
        setFullname(user?.username);
        setEmail(user?.email);
        setPhoneNumber(user?.phone);
      }
    })();
  }, [selectedAssessment?.streetId]);

  useEffect(() => {
    (async () => {
      if (selectedAssessment?.streetId) {
        const response = await getWardsByStreetId(selectedAssessment?.streetId);
        if ('statusCode' in response) {
        } else {
          setWards(response);
          if (response.length > 0) {
            const updatedSearch = {
              ...selectedAssessment,
              ward: {id: response[0].id, name: response[0].name},
            };
            setSelectedAssessment(
              (ss: SelectedAssessmentDetails) => updatedSearch,
            );
          }
        }
      }
    })();
  }, [selectedAssessment?.streetId]);

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

  useEffect(() => {
    (async () => {
      if (selectedAssessment?.ward?.id) {
        const response = await getZonesByWardId(selectedAssessment?.ward?.id);
        if ('statusCode' in response) {
        } else {
          setZones(response);
          if (response.length > 0) {
            const updatedSearch = {
              ...selectedAssessment,
              zone: {id: response[0].id, name: response[0].name},
            };
            setSelectedAssessment(
              (ss: SelectedAssessmentDetails) => updatedSearch,
            );
          }
        }
      }
    })();
  }, [selectedAssessment?.ward]);

  const handleSelectItem = (street: Street) => {
    const updatedUser = {
      streetId: street.streetId,
      streetName: street.streetName,
      ward: {id: 0, name: ''},
      zone: {id: 0, name: ''},
      address: '',
    };
    setSelectedAssessment((ss: SelectedAssessmentDetails) => updatedUser);
  };

  const renderWardAndZone = (key: string, data: Zone[]) => {
    if (data.length <= 0) {
      return (
        <Picker.Item
          style={styles.text}
          key={123}
          label={key === 'ward' ? i18n.t('select_ward') : i18n.t('select_zone')}
          value={null}
        />
      );
    }
    return data?.map(item => (
      <Picker.Item
        style={styles.text}
        key={item.id}
        label={item.name}
        value={item}
      />
    ));
  };

  const renderDepartments = (data: Department[] | undefined) => {
    if (!data) {
      return (
        <Picker.Item
          style={styles.text}
          key={123}
          label={i18n.t('select_department')}
          value={null}
        />
      );
    }
    return data?.map(item => (
      <Picker.Item
        style={styles.text}
        key={item.id}
        label={item.name}
        value={item}
      />
    ));
  };

  const renderCategories = (data: Category[] | undefined) => {
    if (!data) {
      return (
        <Picker.Item
          style={styles.text}
          key={123}
          label={i18n.t('select_category')}
          value={null}
        />
      );
    }
    return data?.map(item => (
      <Picker.Item
        style={styles.text}
        key={item.id}
        label={item.complaint_cat_name}
        value={item}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: theme.colors.whitecolor,
          borderRadius: 8,
          marginBottom: 10,
          marginLeft: 10,
          marginRight: 10,
        }}>
        <PText style={styles.title1} theme={theme}>
          {i18n.t('assessment_details')}
        </PText>
        <PText style={styles.textTitle} theme={theme}>
          {i18n.t('streetname')}
        </PText>
        <TInput
          placeholder={`${i18n.t('enter')}${i18n.t('streetname')}`}
          onTouchEnd={() => {
            clearSearch();
            navigation.navigate('AutoCompleteSearch', {
              onSelect: handleSelectItem,
              streets,
            });
          }}
          style={styles.searchtextcontent}
          theme={theme}>
          {selectedAssessment?.streetId === 0
            ? i18n.t('type_to_search')
            : selectedAssessment?.streetName}
        </TInput>
        <PText style={styles.textTitle} theme={theme}>
          {i18n.t('wardno')}
        </PText>
        <Picker
          style={styles.picker}
          placeholder={i18n.t('select_ward_no')}
          selectedValue={selectedAssessment?.ward!}
          onValueChange={(itemValue: Ward) => {
            setSelectedAssessment((ss: SelectedAssessmentDetails) => {
              return {...ss, ward: itemValue};
            });
          }}>
          {renderWardAndZone('ward', wardsList)}
        </Picker>
        <PText style={styles.textTitle} theme={theme}>
          {i18n.t('zone')}
        </PText>
        <Picker
          style={styles.picker}
          placeholder={i18n.t('select_zone')}
          selectedValue={selectedAssessment?.zone!}
          onValueChange={(itemValue: Zone) => {
            setSelectedAssessment((ss: SelectedAssessmentDetails) => {
              return {...ss, zone: itemValue};
            });
          }}>
          {renderWardAndZone('zone', zonesList)}
        </Picker>
        <PText style={styles.textTitle} theme={theme}>
          {i18n.t('landmark_address')}
        </PText>
        <TInput
          style={styles.address}
          value={address}
          maxLength={50}
          placeholder={`${i18n.t('enter')}${i18n.t('landmark_address')}`}
          numberOfLines={1}
          onChangeText={(address: string) => setAddress(address)}
          theme={theme}
        />
      </View>

      <View
        style={{
          backgroundColor: theme.colors.whitecolor,
          borderRadius: 8,
          marginBottom: 10,
          marginLeft: 10,
          marginRight: 10,
        }}>
        <PText style={styles.title2} theme={theme}>
          {i18n.t('personal_details')}
        </PText>
        <PText style={styles.textTitle} theme={theme}>
          {i18n.t('fullname')}
        </PText>
        <TInput
          style={styles.address}
          theme={theme}
          value={fullname}
          placeholder={`${i18n.t('enter')}${i18n.t('fullname')}`}
          maxLength={50}
          numberOfLines={1}
          onChangeText={name => {
            setFullname(name);
          }}></TInput>
        <PText style={styles.personDetails} theme={theme}>
          {i18n.t('contact_number')}
        </PText>
        <TInput
          keyboardType="phone-pad"
          value={phoneNumber}
          style={styles.address}
          maxLength={10}
          numberOfLines={1}
          onChangeText={(phone: string) => {
            setPhoneNumber(phone);
          }}
          theme={theme}></TInput>
        <PText style={styles.personDetails} theme={theme}>
          {i18n.t('email')}
        </PText>
        <TInput
          style={styles.address}
          value={email}
          maxLength={50}
          numberOfLines={1}
          placeholder={`${i18n.t('enter')}${i18n.t('email')}`}
          keyboardType="email-address"
          onChangeText={email => {
            setEmail(email);
          }}
          theme={theme}></TInput>
      </View>

      <View
        style={{
          backgroundColor: theme.colors.whitecolor,
          borderRadius: 8,
          marginBottom: 10,
          marginLeft: 10,
          marginRight: 10,
        }}>
        <PText style={styles.title2} theme={theme}>
          {i18n.t('complaintdetails')}
        </PText>
        <PText style={styles.textTitle} theme={theme}>
          {i18n.t('department')}
        </PText>
        <Picker
          style={styles.picker}
          placeholder={i18n.t('select_department')}
          selectedValue={selectDepartment!}
          onValueChange={(itemValue: Zone) => {
            setSelectDepartment(itemValue);
          }}>
          {renderDepartments(departments)}
        </Picker>
        <PText style={styles.personDetails} theme={theme}>
          {i18n.t('category')}
        </PText>
        <Picker
          style={styles.picker}
          placeholder={i18n.t('select_category')}
          selectedValue={selectCategory!}
          onValueChange={(itemValue: Category) => {
            setSelectCategory(itemValue);
          }}>
          {renderCategories(categories)}
        </Picker>
        <PText style={styles.personDetails} theme={theme}>
          {i18n.t('file_a_complaint')}
        </PText>
        <TInput
          style={styles.cd}
          theme={theme}
          maxLength={400}
          multiline={true}
          numberOfLines={5}
          placeholder={`${i18n.t('enter')}${i18n.t('complaintdetails')}`}
          onChangeText={complaintDescription => {
            setComplaintDescription(complaintDescription);
          }}></TInput>
      </View>

      <View
        style={{
          backgroundColor: theme.colors.whitecolor,
          borderRadius: 8,
          marginBottom: 10,
          marginLeft: 10,
          marginRight: 10,
        }}>
        <AttachmentComponent maxAllowed={4} files={fileArray} theme={theme} />
      </View>
      <View style={{backgroundColor: theme.colors.whitecolor}}>
        <View style={styles.submitButtonContainer}>
          <PText
            style={styles.submitText}
            theme={theme}
            onPress={async () => {
              if (
                selectedAssessment?.streetName === null ||
                selectedAssessment?.zone?.id === null ||
                selectedAssessment?.ward?.id === null ||
                address === null ||
                phoneNumber === null ||
                selectDepartment?.name === null ||
                selectDepartment?.id === null ||
                selectCategory?.id === null ||
                complaintDescription.length === 0
              ) {
                showFailureToast(i18n.t('please_fill_all_fields'));
                return;
              } else {
                const request = {
                  ASSN_STREET: selectedAssessment?.streetName,
                  ASSN_ZONE: selectedAssessment?.zone?.id,
                  ASSN_WARD: selectedAssessment?.ward?.id,
                  ASSN_LOCATION: address,
                  COMP_MOB: phoneNumber,
                  COMP_EMAIL: email,
                  DEPT_NAME: selectDepartment?.name,
                  DEPT_CAT: selectCategory?.id,
                  DEPT_ID: selectDepartment?.id,
                  DEPT_DESCRIPTION: complaintDescription,
                  lat: location?.latitude,
                  lng: location?.longitude,
                  source: 'Mobile',
                  fullname: fullname,
                };
                const response = await createTicket(request, fileArray);
                if (
                  response.statusCode ===
                  TErrorCodes.TICKET_CREATED_SUCCESSFULLY
                ) {
                  setTicketId(response.message);
                  setSuccessModelVisible(true);
                } else {
                  showFailureToast(response.message);
                }
              }
            }}>
            {i18n.t('submit')}
          </PText>
        </View>
      </View>
      <TicketSuccessModel
        visible={successModelVisible}
        ticketId={ticketId}
        msg={i18n.t('complaint_success')}
        onClose={() => {
          setSuccessModelVisible(false);
          navigation.goBack();
        }}
        theme={theme}></TicketSuccessModel>
    </View>
  );
};
const generateStyles = (theme: Theme) =>
  StyleSheet.create({
    attachtext: {
      marginLeft: 10,
    },
    attachContainer: {
      flexDirection: 'row',
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'black',
      borderStyle: 'dashed',
    },
    container: {
      flex: 1,
    },
    scrollViewContent: {
      flexGrow: 1,
      paddingVertical: 20,
    },
    email: {
      marginBottom: '20%',
    },
    address: {
      width: '90%',
      backgroundColor: theme.colors.cream,
      borderRadius: 5,
      paddingLeft: 10,
      marginLeft: 10,
      marginRight: 10,
      paddingRight: 10,
      color: theme.colors.gray,
    },
    cd: {
      width: '90%',
      backgroundColor: theme.colors.cream,
      borderRadius: 5,
      textAlign: 'left', // Ensure text alignment is left
      textAlignVertical: 'top', // Ensure text is aligned to the top
      paddingLeft: 10,
      paddingRight: 10,
      color: theme.colors.gray,
    },
    text: {
      color: theme.colors.gray,
      fontFamily: theme.fonts.regular,
    },
    picker: {
      borderRadius: 8,
      width: '95%',
      marginLeft: 10,
      marginRight: 10,

      backgroundColor: theme.colors.cream,
    },
    title1: {
      color: theme.colors.primary,
      fontFamily: theme.fonts.regular,
      fontSize: theme.fontSizes.thick,
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 20,
    },
    title2: {
      color: theme.colors.primary,
      fontFamily: theme.fonts.regular,
      fontSize: theme.fontSizes.thick,
      paddingLeft: 10,
      paddingRight: 10,
    },
    textTitle: {
      color: theme.colors.textcolor,
      fontFamily: theme.fonts.regular,
      fontSize: theme.fontSizes.medium,
      paddingLeft: 10,
      paddingRight: 10,
      marginTop: 10,
    },
    personDetails: {
      color: theme.colors.textcolor,
      fontFamily: theme.fonts.regular,
      fontSize: theme.fontSizes.medium,
      paddingLeft: 10,
      paddingRight: 10,
    },
    textcontent: {
      color: theme.colors.textcolor,
      fontFamily: theme.fonts.regular,
      fontSize: theme.fontSizes.medium,
      paddingLeft: 10,
      paddingRight: 10,
    },
    searchtextcontent: {
      color: theme.colors.gray,
      backgroundColor: theme.colors.cream,
      fontFamily: theme.fonts.regular,
      fontSize: theme.fontSizes.xthin,
      padding: 10,
      marginLeft: 10,
      marginRight: 10,
      marginTop: 5,
      borderRadius: 5,
    },
    submitButtonContainer: {
      left: 0,
      right: 0,
      marginTop: 15,
      paddingTop: 10,
      paddingBottom: 10,
      borderRadius: 8,
      marginBottom: 20,
      marginLeft: '10%',
      marginRight: '10%',
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 20,
    },
    submitText: {
      textAlign: 'center',
      color: theme.colors.whitecolor,
    },
    icon: {
      width: 25,
      height: 25,
    },
  });

export default withGeolocation(withStreetWardAndZones(AssessmentDetailInput));
