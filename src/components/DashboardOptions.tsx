import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import {complaintImg, viewstatusImg} from '../assets';
import PText from './PText';
import React from 'react';
import {Theme} from '../theme/ThemeProvider';
import i18n from '../../i18n';

interface DashboardOptionsPros {
  theme: Theme;
  onFileComplaint: () => void;
  onViewStatus: () => void;
}

const DashboardOptions: React.FC<DashboardOptionsPros> = ({
  theme,
  onFileComplaint,
  onViewStatus,
}) => {
  const styles = generateStyles(theme);
  return (
    <>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.parent}
          onPress={() => {
            onFileComplaint();
          }}>
          <View>
            <ImageBackground
              source={complaintImg}
              resizeMode="center"
              style={styles.img}
            />
            <PText style={styles.optionsTitlext} theme={theme}>
              {i18n.t('file_a_complaint')}
            </PText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.parent}
          onPress={() => {
            onViewStatus();
          }}>
          <View>
            <ImageBackground
              resizeMode="center"
              source={viewstatusImg}
              style={styles.img}
            />

            <PText style={styles.optionsTitlext} theme={theme}>
              {i18n.t('view_status')}
            </PText>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};
const generateStyles = (theme: Theme) =>
  StyleSheet.create({
    img: {
      height: 100,
      width: 100,
    },
    parent: {
      width: '40%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    imgview: {
      height: 100,
      width: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    optionsContainer: {
      flexDirection: 'row',
      width: '100%',
      height: '40%',
      gap: 10,
      justifyContent: 'space-around',
      alignItems: 'center',
    },

    optionsTitlext: {
      color: theme.colors.primary,
      fontFamily: theme.fonts.bold,
      fontSize: theme.fontSizes.xthin,
      marginTop: 10,
      maxWidth: '100%',
      height: 100,
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    },
  });
export default DashboardOptions;
