import {StatusBar, StyleSheet, View} from 'react-native';
import {Theme, useTheme} from '../theme/ThemeProvider';
import PText from '../components/PText';
import React, {useState} from 'react';
import {Complaint} from '../models/Complaint';
import {RouteProp, useRoute} from '@react-navigation/native';
import {GestureHandlerRootView, ScrollView} from 'react-native-gesture-handler';
import TitleDescriptionComponent from '../components/TitleDescription';
import i18n from '../../i18n';
import ImagesList from '../components/ImagesList';
import ManageTicket from './ManageTicket';
import {User} from '../models/User';
import {Image} from 'react-native-elements';
import ImagePreviewModal from '../components/ImagePreviewModel';

type ComplaintDetailsRouteProp = RouteProp<
  {
    ComplaintDetails: {
      complaint: Complaint;
      user: User;
    };
  },
  'ComplaintDetails'
>;

const ComplaintDetails = () => {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const route = useRoute<ComplaintDetailsRouteProp>();
  const params = route.params;
  const complaint = params.complaint;
  const user = params.user;
  const styles = generateStyles(theme);

  return (
    <GestureHandlerRootView>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.primary}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: theme.colors.cream}}>
        <View style={styles.ticketRow}>
          <PText
            style={{
              color: theme.colors.primary,
              fontFamily: theme.fonts.bold,
            }}
            theme={theme}>
            #{complaint.ticket_id}
          </PText>
          <PText
            style={[
              styles.status,
              {
                backgroundColor:
                  complaint?.STATUS === 'Closed'
                    ? theme.colors.close
                    : complaint?.STATUS === 'In Progress'
                    ? theme.colors.inprogress
                    : theme.colors.open,
              },
            ]}
            theme={theme}>
            {complaint?.STATUS}
          </PText>
        </View>
        <View style={styles.assessmentDetailsContainer}>
          <PText
            style={{
              color: theme.colors.primary,
              fontFamily: theme.fonts.bold,
              marginTop: 10,
              marginLeft: 10,
            }}
            theme={theme}>
            {i18n.t('assessment_details')}
          </PText>
          <View style={styles.jrow}>
            <TitleDescriptionComponent
              theme={theme}
              title={i18n.t('streetname')}
              description={complaint.ASSN_STREET}
            />
            <TitleDescriptionComponent
              theme={theme}
              title={i18n.t('wardno')}
              description={complaint.ward_name}
            />
          </View>
          <View style={styles.jrow}>
            <TitleDescriptionComponent
              theme={theme}
              title={i18n.t('zone')}
              description={complaint.zone_name}
            />
            <TitleDescriptionComponent
              theme={theme}
              title={i18n.t('landmark')}
              description={complaint.ASSN_LOCATION}
            />
          </View>
        </View>
        <View style={styles.personalDetailsContainer}>
          <PText
            style={{
              color: theme.colors.primary,
              fontFamily: theme.fonts.bold,
              marginTop: 10,
              marginLeft: 10,
            }}
            theme={theme}>
            {i18n.t('personal_details')}
          </PText>
          <View style={styles.jrow}>
            <TitleDescriptionComponent
              theme={theme}
              title={i18n.t('fullname')}
              description={complaint.emp_name}
            />
            <TitleDescriptionComponent
              theme={theme}
              title={i18n.t('contactnumber')}
              description={complaint.COMP_MOB}
            />
          </View>
          <View style={styles.jrow}>
            <TitleDescriptionComponent
              theme={theme}
              title={i18n.t('email')}
              description={complaint.COMP_EMAIL}
            />
          </View>
        </View>
        <View style={styles.complaintDetailsContainer}>
          <PText
            style={{
              color: theme.colors.primary,
              fontFamily: theme.fonts.bold,
              marginTop: 10,
              marginLeft: 10,
            }}
            theme={theme}>
            {i18n.t('complaintdetails')}
          </PText>

          <View style={styles.jrow}>
            <TitleDescriptionComponent
              theme={theme}
              title={i18n.t('department')}
              description={complaint.dept_name}
            />
            <TitleDescriptionComponent
              theme={theme}
              title={i18n.t('category')}
              description={complaint.complaint_cat_name}
            />
          </View>
          <View style={styles.jrow}>
            <View>
              <PText style={styles.title} theme={theme}>
                {i18n.t('complaint')}
              </PText>
              <PText style={styles.description} theme={theme}>
                {complaint.DEPT_DESCRIPTION}
              </PText>
              <PText style={styles.attachments} theme={theme}>
                {i18n.t('attachments')}
              </PText>
              <ImagesList ticketId={complaint.ticket_id} theme={theme} />
              <PText style={styles.attachments} theme={theme}>
                Remarks
              </PText>
              <PText style={styles.description} theme={theme}>
                {complaint.remark || '-'}
              </PText>
              <PText style={styles.description} theme={theme}>
                {complaint.date || '-'}
              </PText>
              <PText style={styles.attachments} theme={theme}>
                {i18n.t('closed_attachments')}
              </PText>
              <ImagePreviewModal
                theme={theme}
                visible={modalVisible}
                imageURL={complaint.closedimage}
                onClose={() => {
                  setModalVisible(false);
                }}
                onDelete={null}
              />
              <Image
                onPress={() => {
                  console.log(complaint.closedimage);
                  setModalVisible(true);
                }}
                source={{uri: complaint.closedimage}}
                style={styles.image}
              />
            </View>
          </View>
        </View>
        {complaint.STATUS !== 'Closed' && user?.isStaff && (
          <View style={styles.complaintDetailsContainer}>
            <ManageTicket ticket={complaint} />
          </View>
        )}
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const generateStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      marginLeft: 5,
      marginRight: 5,
      marginTop: 15,
      backgroundColor: theme.colors.cream,
    },
    status: {
      fontSize: theme.fontSizes.xthin,
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 5,
      borderRadius: 8,
      color: theme.colors.whitecolor,
    },
    title: {
      color: theme.colors.gray,
      fontSize: 16,
    },
    description: {
      color: theme.colors.textcolor,
      fontSize: 14,
    },
    attachments: {
      color: theme.colors.textcolor,
      fontSize: 14,
      marginTop: 10,
    },

    ticketRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.whitecolor,
      borderRadius: 8,
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 10,
      paddingBottom: 10,
      marginLeft: 10,
      marginRight: 10,
      marginTop: 10,
      marginBottom: 10,
    },
    image: {
      width: 100,
      height: 100,
      margin: 5,
      resizeMode: 'cover',
    },
    jrow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderRadius: 8,
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 10,
      paddingBottom: 10,
    },
    assessmentDetailsContainer: {
      backgroundColor: theme.colors.whitecolor,
      borderRadius: 8,
      marginLeft: 10,
      marginRight: 10,
    },
    personalDetailsContainer: {
      backgroundColor: theme.colors.whitecolor,
      borderRadius: 8,
      marginLeft: 10,
      marginRight: 10,
      marginTop: 10,
    },
    complaintDetailsContainer: {
      backgroundColor: theme.colors.whitecolor,
      borderRadius: 8,
      marginLeft: 10,
      marginRight: 10,
      marginTop: 10,
    },
  });

export default ComplaintDetails;
