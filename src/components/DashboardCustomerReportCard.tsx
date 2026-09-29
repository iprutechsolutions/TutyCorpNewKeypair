import React, {useEffect} from 'react';
import {View} from 'react-native';
import PText from './PText';
import theme from '../theme/theme';
import {getTicketsCount} from '../services/ticket.api';
import {getUserFromStorage} from '../store/user';

const DashboardCustomerReportCard = () => {
  useEffect(() => {
    (async () => {
      const user = await getUserFromStorage();
      if (user) {
        const response = await getTicketsCount(user?.phone);
      }
    })();
  }, []);
  return (
    <View>
      <PText theme={theme}>Customer Report</PText>
    </View>
  );
};
export default DashboardCustomerReportCard;
