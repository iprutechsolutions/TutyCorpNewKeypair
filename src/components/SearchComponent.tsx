import React, {useState} from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';
import {Theme} from '../theme/ThemeProvider';
import TInput from './TInput';
import {Image} from 'react-native-elements';
import {closedTicketsImg, homeImg, searchBgImg, searchImg} from '../assets';
import Icon from 'react-native-vector-icons/FontAwesome';
import i18n from '../../i18n';
import ToastManager from 'toastify-react-native';

type SearchProps = {
  theme: Theme;
  onSearch: (searchTerm: string) => void;
  placeholder: string;
};

const SearchComponent: React.FC<SearchProps> = ({
  theme,
  onSearch,
  placeholder,
}) => {
  const styles = generateStyles(theme);
  const [searchTerm, setSearch] = useState('');
  return (
    <View style={styles.searchContainder}>
      <TInput
        inputContainerStyle={styles.hideBottomBorder}
        containerStyle={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.gray}
        onChangeText={(text: string) => {
          setSearch(text);
        }}
        style={styles.searchInput}
        keyboardType="phone-pad"
        theme={theme}></TInput>
      <Image
        source={searchImg}
        style={styles.icon}
        onPress={() => onSearch(searchTerm)}
      />
    </View>
  );
};
const generateStyles = (theme: Theme) =>
  StyleSheet.create({
    searchContainder: {
      width: '95%',
      height: 50,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 10,
      marginRight: 5,
      borderRadius: 10,
      marginBottom: 10,
      marginTop: 10,
      backgroundColor: theme.colors.whitecolor,
    },
    placeholderTextColor: {
      color: theme.colors.red,
    },

    searchInput: {
      width: '90%',
      height: 50,
      textAlign: 'left',
      color: theme.colors.textcolor,
      fontFamily: theme.fonts.regular,
      fontSize: theme.fontSizes.xthin,
    },
    icon: {
      width: 25,
      marginRight: 10,
      height: 25,
    },
    hideBottomBorder: {
      borderBottomWidth: 0,
      borderLeftWidth: 0,
    },
  });
export default SearchComponent;
