import React, {useCallback, useEffect, useState} from 'react';
import {StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Theme, useTheme} from '../theme/ThemeProvider';
import PText from '../components/PText';
import TicketsReport from '../components/TicketsReport';
import {Image} from 'react-native-elements';
import {
  allTicketsImg,
  closedTicketsImg,
  complaintImg,
  ongoingTicketsImg,
  viewTicketsImg,
  viewstatusImg,
} from '../assets';
import {useNavigation} from '@react-navigation/native';
import PCard from '../components/PCard';
import i18n from '../../i18n';
import {getUserFromStorage} from '../store/user';
import {User} from '../models/User';
import {getTicketsCountForStaff} from '../services/ticket.api';
import {TicketCounts} from '../models/TicketCounts';
import {GestureHandlerRootView, ScrollView} from 'react-native-gesture-handler';
import {useFocusEffect} from '@react-navigation/native';

const StaffHomeScreen = () => {
  const theme = useTheme();
  const [user, setUser] = useState<User>();
  const [count, setCount] = useState<TicketCounts>();
  const navigation = useNavigation();
  const styles = generateStyles(theme);
  useEffect(() => {
    (async () => {
      const user = await getUserFromStorage();
      if (user?.ID) {
        const response = await getTicketsCountForStaff(user?.ID, user?.role);
        if ('statusCode' in response && 'message' in response) {
        } else {
          setCount(response);
        }
      }
      if (user) setUser(user);
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const user = await getUserFromStorage();
        if (user?.ID) {
          const response = await getTicketsCountForStaff(user?.ID, user?.role);
          if ('statusCode' in response && 'message' in response) {
          } else {
            setCount(response);
          }
        }
        if (user) setUser(user);
      })();
    }, []),
  );

  return (
    <>
      <StatusBar
        backgroundColor={theme.colors.cream}
        barStyle="dark-content"></StatusBar>
      <GestureHandlerRootView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.root}>
            <PText style={styles.profileName} theme={theme}>
              {user && `${i18n.t('hello')} ${user.username}`}
            </PText>
            {count && parseInt(count?.total) > 0 && (
              <TicketsReport count={count!} theme={theme} />
            )}
            <View style={styles.optionsContainer}>
              <View style={styles.flexRow}>
                <PCard
                  theme={theme}
                  count={count?.open!}
                  color={theme.colors.red}
                  title={i18n.t('open')}
                  backgroundColor={theme.colors.cream}
                  onSelect={() => {
                    navigation.navigate('ListComplaints', {
                      defaultFilter: i18n.t('open'),
                      allticketcount: Number(count?.total!),
                    });
                  }}
                />
                <PCard
                  theme={theme}
                  count={count?.Ongoing!}
                  backgroundColor={theme.colors.cream}
                  color={theme.colors.orange}
                  title={i18n.t('inprogress')}
                  onSelect={() => {
                    navigation.navigate('ListComplaints', {
                      defaultFilter: i18n.t('inprogress'),
                      allticketcount: Number(count?.total!),
                    });
                  }}
                />
              </View>
              <View style={styles.flexRow}>
                <PCard
                  count={count?.Closed!}
                  backgroundColor={theme.colors.cream}
                  color={theme.colors.green}
                  theme={theme}
                  title={i18n.t('closed')}
                  onSelect={() => {
                    navigation.navigate('ListComplaints', {
                      defaultFilter: i18n.t('closed'),
                      allticketcount: Number(count?.total!),
                    });
                  }}
                />
                <PCard
                  count={count?.total!}
                  color={theme.colors.whitecolor}
                  theme={theme}
                  backgroundColor={theme.colors.primary}
                  title={i18n.t('all_tickets')}
                  onSelect={() => {
                    navigation.navigate('ListComplaints', {
                      defaultFilter: i18n.t('all'),
                      allticketcount: Number(count?.total!),
                    });
                  }}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </GestureHandlerRootView>
    </>
  );
};
const generateStyles = (theme: Theme) =>
  StyleSheet.create({
    root: {
      margin: 10,
      backgroundColor: theme.colors.whitecolor,
    },
    profileName: {
      color: theme.colors.primary,
      fontFamily: theme.fonts.regular,
      fontSize: theme.fontSizes.xthick,
      marginTop: '7%',
      marginLeft: 5,
    },
    selectOption: {
      color: theme.colors.primary,
      fontFamily: theme.fonts.bold,
      fontSize: theme.fontSizes.medium,
      fontWeight: '600',
      marginTop: '15%',
    },
    img: {
      height: 150,
      width: 170,
      borderRadius: 10,
    },
    flexRow: {
      flexDirection: 'row',
      gap: 20,
      justifyContent: 'center',
      marginTop: 15,
      marginBottom: 20,
    },
    optionsContainer: {
      marginTop: '15%',
    },

    optionsTitlext: {
      color: theme.colors.primary,
      fontFamily: theme.fonts.bold,
      fontSize: theme.fontSizes.medium,
      textAlign: 'center',
      marginTop: 10,
    },
  });
export default StaffHomeScreen;
