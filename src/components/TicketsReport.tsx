import React from 'react';
import {StyleSheet, View} from 'react-native';
import PieChart from 'react-native-pie-chart';
import PText from './PText';
import {Theme} from '../theme/ThemeProvider';
import i18n from '../../i18n';
import {TicketCounts} from '../models/TicketCounts';
interface TicketsReportProps {
  theme: Theme;
  count: TicketCounts;
}
const TicketsReport: React.FC<TicketsReportProps> = ({theme, count}) => {
  const styles = generateStyles(theme);

  const widthAndHeight = 200;
  const series = [
    parseInt(count?.open, 10),
    parseInt(count?.Closed, 10),
    parseInt(count?.Ongoing, 10),
  ];
  const sliceColor = [
    theme.colors.red,
    theme.colors.green,
    theme.colors.orange,
  ];

  return (
    <>
      <PieChart
        widthAndHeight={widthAndHeight}
        series={series}
        sliceColor={sliceColor}
        coverRadius={0.8}
        style={styles.pie}
        coverFill={'#FFF'}
      />
      <View style={styles.indiContainer}>
        <View style={styles.indiContainer}>
          <View style={styles.indiBox1} />
          <PText style={styles.statusTxt} theme={theme}>
            {i18n.t('open')}
          </PText>
        </View>
        <View style={styles.indiContainer}>
          <View style={styles.indiBox2} />
          <PText style={styles.statusTxt} theme={theme}>
            {i18n.t('inprogress')}
          </PText>
        </View>
        <View style={styles.indiContainer}>
          <View style={styles.indiBox3} />
          <PText style={styles.statusTxt} theme={theme}>
            {i18n.t('closed')}
          </PText>
        </View>
      </View>
      <View style={styles.tcount}>
        <PText style={styles.tcountTxt} theme={theme}>
          {i18n.t('total_tickets')}
        </PText>
        <PText style={styles.tcountNumber} theme={theme}>
          {count?.total}
        </PText>
      </View>
    </>
  );
};
const generateStyles = (theme: Theme) =>
  StyleSheet.create({
    pie: {
      alignSelf: 'center',
      marginTop: 10,
      position: 'relative',
    },
    indiContainer: {
      flexDirection: 'row',
      marginTop: 10,
      justifyContent: 'space-evenly',
    },
    indiBox1: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.colors.red,
    },
    indiBox2: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.colors.orange,
    },
    indiBox3: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.colors.green,
    },
    statusTxt: {
      height: 25,
      alignSelf: 'center',
      marginLeft: 10,
    },
    tcount: {
      position: 'absolute',
      justifyContent: 'center',
      alignSelf: 'center',
      marginTop: '27%',
    },
    tcountTxt: {
      color: theme.colors.gray,
      fontSize: theme.fontSizes.medium,
      fontFamily: theme.fonts.regular,
      textAlign: 'center',
    },
    tcountNumber: {
      color: theme.colors.textcolor,
      fontSize: theme.fontSizes.xthick,
      fontFamily: theme.fonts.bold,
      textAlign: 'center',
    },
  });
export default TicketsReport;
