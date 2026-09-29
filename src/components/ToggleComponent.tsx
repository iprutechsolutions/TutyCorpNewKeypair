import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import PText from './PText';
import theme from '../theme/theme';
import {Theme} from '../theme/ThemeProvider';
import i18n from '../../i18n';
interface ToggleProps {
  theme: Theme;
  isStaff: boolean;
}

const ToggleComponent: React.FC<ToggleProps> = ({theme, isStaff}) => {
  const [isTicketDetailsSel, setIsTicketDetailsSel] = useState(true);
  const styles = generateStyles(theme);

  return (
    <View style={styles.containder}>
      <PText
        onPress={() => setIsTicketDetailsSel(true)}
        style={[
          styles.tHeader,
          isTicketDetailsSel
            ? {
                backgroundColor: theme.colors.whitecolor,
                color: theme.colors.primary,
              }
            : {
                backgroundColor: theme.colors.primary,
                color: theme.colors.whitecolor,
              },
        ]}
        theme={theme}>
        {isStaff ? i18n.t('ticketdetails') : i18n.t('assessmentdetails')}
      </PText>
      <PText
        onPress={() => setIsTicketDetailsSel(false)}
        style={[
          styles.tHeader,
          !isTicketDetailsSel
            ? {
                backgroundColor: theme.colors.whitecolor,
                color: theme.colors.primary,
              }
            : {
                backgroundColor: theme.colors.primary,
                color: theme.colors.whitecolor,
              },
        ]}
        theme={theme}>
        {isStaff ? i18n.t('complaintdetails') : i18n.t('personalinfo')}
      </PText>
    </View>
  );
};
export default ToggleComponent;
const generateStyles = (theme: Theme) =>
  StyleSheet.create({
    containder: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: '100%',
      padding: 10,
      backgroundColor: theme.colors.primary,
      marginTop: 10,
      borderRadius: 10,
      gap: 20,
    },
    tHeader: {
      width: '50%',
      color: theme.colors.primary,
      backgroundColor: theme.colors.whitecolor,
      paddingTop: 5,
      paddingBottom: 5,
      borderRadius: 10,
      textAlign: 'center',
    },
  });
