import React, {useState} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {Street} from '../models/Street';
import PText from './PText';
import {Theme, useTheme} from '../theme/ThemeProvider';
import {RouteProp, useRoute} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';

type AutoCompleteSearchProps = RouteProp<
  {AutoCompleteSearch: {streets: Street[]; onSelect: (street: Street) => void}},
  'AutoCompleteSearch'
>;

const AutocompleteInput = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const route = useRoute<AutoCompleteSearchProps>();
  const {streets, onSelect} = route.params;
  const [query, setQuery] = useState('');
  const [filteredData, setFilteredData] = useState<Street[]>(streets);
  const styles = generateStyles(theme);
  const handleInputChange = (text: string) => {
    setQuery(text);
    // Filter the data based on the input query
    const filtered = streets.filter((item: Street) =>
      item.streetName.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredData(filtered);
  };

  const renderItem = (item: any) => (
    <PText
      onPress={() => {
        onSelect(item.item);
        navigation.goBack();
      }}
      style={styles.listItem}
      theme={theme}>
      {item.item.streetName}
    </PText>
  );

  return (
    <View
      style={{
        backgroundColor: theme.colors.cream,
      }}>
      <StatusBar
        backgroundColor={theme.colors.primary}
        barStyle="light-content"
      />

      <TextInput
        style={{
          height: 40,
          margin: 10,
          borderColor: theme.colors.textcolor,
          paddingHorizontal: 10,
          paddingVertical: 10,
          backgroundColor: 'white',
          textAlign: 'left',
          borderRadius: 8,
          fontFamily: theme.fonts.regular,
          fontSize: theme.fontSizes.xthin,
          color: theme.colors.textcolor,
        }}
        placeholder="Type street name"
        onChangeText={handleInputChange}
        value={query}
      />
      {filteredData?.length > 0 && (
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={item => item.streetId + item.streetName}
        />
      )}
    </View>
  );
};
const generateStyles = (theme: Theme) =>
  StyleSheet.create({
    listItem: {
      color: theme.colors.textcolor,
      marginLeft: 10,
      marginRight: 10,
      padding: 10,
    },
  });
export default AutocompleteInput;
