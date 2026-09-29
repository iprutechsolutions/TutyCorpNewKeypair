import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {
  GestureHandlerRootView,
  ScrollView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import PText from '../components/PText';
import {frongArrowImg} from '../assets';
import i18n from '../../i18n';
import {Theme} from '../theme/ThemeProvider';
import theme from '../theme/theme';
const TicketItem = ({navigation, item, user}) => {
  const styles = generateStyles(theme);
  return (
    <GestureHandlerRootView>
      <TouchableOpacity
        onPress={() => {
          console.log(JSON.stringify(item));
          navigation.navigate('ComplaintDetails', {
            complaint: item,
            user: user!,
          });
        }}>
        <View style={styles.ticketContainer}>
          <View style={styles.idAndDate}>
            <View>
              <PText theme={theme}>
                <PText style={styles.title} theme={theme}>
                  {`${i18n.t('ticketno')} : `}
                </PText>
                <PText style={styles.listItem} theme={theme}>
                  {`#${item?.ticket_id}`}
                </PText>
              </PText>
              <PText style={styles.listItem} theme={theme}>
                <PText style={styles.title} theme={theme}>
                  {`${i18n.t('date')} : `}
                </PText>
                <PText style={styles.listItem} theme={theme}>
                  {item?.DATEOFSUBMIT}
                </PText>
              </PText>
            </View>
            <View>
              <PText
                style={[
                  styles.status,
                  {
                    backgroundColor:
                      item?.STATUS === 'Closed'
                        ? theme.colors.close
                        : item?.STATUS === 'In Progress'
                        ? theme.colors.inprogress
                        : theme.colors.open,
                  },
                ]}
                theme={theme}>
                {item?.STATUS}
              </PText>
            </View>
          </View>
          <View style={styles.arrowSec}>
            <View>
              <PText style={styles.listItem} theme={theme}>
                <PText style={styles.title} theme={theme}>
                  {`${i18n.t('wardno')} : `}
                </PText>
                <PText style={styles.listItem} theme={theme}>
                  {item?.ward_name}
                </PText>
              </PText>
              <PText style={styles.listItem} theme={theme}>
                <PText style={styles.title} theme={theme}>
                  {`${i18n.t('zone')} : `}
                </PText>
                <PText style={styles.listItem} theme={theme}>
                  {item?.zone_name}
                </PText>
              </PText>
              <PText style={styles.listItem} theme={theme}>
                <PText style={styles.title} theme={theme}>
                  {`${i18n.t('department')} : `}
                </PText>
                <PText style={styles.listItem} theme={theme}>
                  {item?.dept_name}
                </PText>
              </PText>
              <PText style={styles.listItem} theme={theme}>
                <PText style={styles.title} theme={theme}>
                  {`${i18n.t('category')} : `}
                </PText>
                <PText style={styles.listItem} theme={theme}>
                  {item?.complaint_cat_name}
                </PText>
              </PText>
            </View>
            <View>
              <Image
                source={frongArrowImg}
                style={{width: 12, height: 12, marginRight: 20}}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
};
const generateStyles = (theme: Theme) =>
  StyleSheet.create({
    ticketContainer: {
      marginTop: 10,
      marginLeft: 10,
      marginRight: 10,
      borderRadius: 8,
      backgroundColor: theme.colors.cream,
    },
    idAndDate: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginLeft: 20,
      marginRight: 20,
      padding: 5,
    },
    arrowSec: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginLeft: 20,
      marginRight: 20,
      paddingLeft: 5,
      paddingRight: 5,
      paddingBottom: 5,
    },
    listItem: {
      color: theme.colors.primary,
    },
    title: {
      color: theme.colors.gray,
    },
    status: {
      color: theme.colors.whitecolor,
      paddingTop: 5,
      paddingLeft: 15,
      paddingRight: 15,
      borderRadius: 8,
      textAlign: 'center',
      fontSize: theme.fontSizes.thin,
      justifyContent: 'center',
      alignItems: 'center',
    },
    allticketsContianer: {
      flex: 1,
      height: 40,
      padding: 5,
      marginBottom: 10,
      backgroundColor: theme.colors.whitecolor,
    },
    allticketContainerData: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.whitecolor,
      padding: 5,
      marginBottom: 10,
    },
    allticketsbold: {
      color: theme.colors.primary,
      fontFamily: theme.fonts.bold,
      fontSize: theme.fontSizes.medium,
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
    },
    alltickets: {
      marginLeft: 10,
      color: theme.colors.primary,
      fontFamily: theme.fonts.regular,
      fontSize: theme.fontSizes.medium,
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
    },
    allticketsCount: {
      marginLeft: 10,
      color: theme.colors.primary,
      fontFamily: theme.fonts.bold,
      fontSize: theme.fontSizes.xthin,
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      alignSelf: 'center',
    },
  });
export default TicketItem;
