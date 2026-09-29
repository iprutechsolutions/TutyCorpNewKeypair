import PText from '../components/PText';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StatusBar,
  StyleSheet,
  View,
  VirtualizedList,
} from 'react-native';
import {Theme, useTheme} from '../theme/ThemeProvider';
import TicketReportTabs from '../components/TicketReportTabs';
import i18n from '../../i18n';
import SearchComponent from '../components/SearchComponent';
import {Complaint} from '../models/Complaint';
import {getUserFromStorage} from '../store/user';
import {getComplaints, getStaffComplaintsList} from '../services/ticket.api';
import {showFailureToast} from '../components/Toast';
import {
  GestureHandlerRootView,
  ScrollView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {frongArrowImg} from '../assets';
import {RouteProp, useRoute} from '@react-navigation/native';
import {User} from '../models/User';
import {useFocusEffect} from '@react-navigation/native';
import TicketItem from './TicketsItem';

type OTPPros = RouteProp<
  {ListComplaints: {defaultFilter: string; allticketcount: number}},
  'ListComplaints'
>;

const ViewComplaintStatus = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute<OTPPros>();
  const defaultFilter = route.params.defaultFilter;
  const allticketcount = route.params.allticketcount;
  const [tickets, setTickets] = useState<Complaint[]>([]);
  const [selectedFilter, setSelectedFilter] = useState(
    defaultFilter ? defaultFilter : i18n.t('all'),
  );

  const [user, setUser] = useState<User>();
  const [query, setQuery] = useState('');

  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [filteredData, setFilteredData] = useState<Complaint[]>(tickets);
  const handleInputChange = (text: string, cat: string) => {
    setQuery(text);
    // Filter the data based on the input query
    let key = 'Open';
    if (cat === i18n.t('inprogress')) {
      key = 'Ongoing';
    } else if (cat === i18n.t('closed')) {
      key = 'Closed';
    } else if (cat === i18n.t('all')) {
      key = 'All';
    }
    // const filtered = tickets.filter((item: Complaint) => {
    //   if (text?.trim().length === 0) {
    //     if (cat === i18n.t('all')) {
    //       return item;
    //     }
    //     if (item?.STATUS?.toLowerCase() === key.toLowerCase()) {
    //       return item;
    //     }
    //   } else if (cat === i18n.t('all')) {
    //     return item?.ticket_id
    //       ?.toLowerCase()
    //       .includes(text?.trim()?.toLowerCase());
    //   }
    //   return (
    //     item?.ticket_id?.toLowerCase().includes(text?.trim()?.toLowerCase()) &&
    //     item?.STATUS?.toLowerCase() === key.toLowerCase()
    //   );
    // });
    setFilteredData(tickets);
  };

  const TicketReportTypes = [
    i18n.t('all'),
    i18n.t('open'),
    i18n.t('inprogress'),
    i18n.t('closed'),
  ];
  useEffect(() => {
    handleInputChange('', selectedFilter);
  }, [tickets]);

  const fetchData = async (key: string) => {
    if (loading) return;

    setLoading(true);

    const user = await getUserFromStorage();
    setUser(user!);
    let response;
    if (user?.isStaff) {
      response = await getStaffComplaintsList(user?.ID, page, key);
    } else {
      response = await getComplaints(user?.phone);
    }

    if ('statusCode' in response && 'message' in response) {
      showFailureToast('Failed');
      setLoading(false);
    } else {
      setHasMore(response.length > 0);
      setTickets(t => [...t, ...response]);
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator style={{margin: 10}} />;
  };

  useFocusEffect(
    useCallback(() => {
      (async () => {
        fetchData(selectedFilter);
      })();
    }, [page]),
  );

  const styles = generateStyles(theme);

  const getItemCount = () => filteredData.length;

  const getItem = (tickets, index) => filteredData[index];

  const ListEmptyComponent = () => (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {loading ? (
        <PText theme={theme}>{i18n.t('loading')}</PText>
      ) : (
        <PText theme={theme}> {i18n.t('tickets_not_found')}</PText>
      )}
    </View>
  );

  return (
    <>
      <StatusBar
        backgroundColor={theme.colors.primary}
        barStyle="light-content"></StatusBar>
      <GestureHandlerRootView style={{height: '7%'}}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TicketReportTabs
            tabs={TicketReportTypes}
            onSelected={function (key: string): void {
              setSelectedFilter(sf => key);
              handleInputChange('', key);
              setTickets([]);
              setPage(0);
              setHasMore(false);
              fetchData(key);
            }}
            selectedItem={selectedFilter}
          />
        </ScrollView>
      </GestureHandlerRootView>
      <SearchComponent
        theme={theme}
        placeholder={i18n.t('search_by_ticket_number')}
        onSearch={function (searchTerm: string): void {
          handleInputChange(searchTerm, selectedFilter);
        }}></SearchComponent>
      <View style={styles.allticketsContianer}>
        <View style={styles.allticketContainerData}>
          <PText style={styles.alltickets} theme={theme}>
            {i18n.t('all_tickets')}
          </PText>
          <PText style={styles.allticketsbold} theme={theme}>
            {allticketcount}
          </PText>
        </View>
        <VirtualizedList
          style={{height: '78%'}}
          data={filteredData}
          renderItem={({item}) => (
            <TicketItem item={item} navigation={navigation} user={user} />
          )}
          getItemCount={getItemCount}
          getItem={getItem}
          ListEmptyComponent={ListEmptyComponent}
          keyExtractor={(item, index) => index.toString()}
          initialNumToRender={getItemCount()} // Ensure all items are rendered initially
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      </View>
    </>
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
export default ViewComplaintStatus;
