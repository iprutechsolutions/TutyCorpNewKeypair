import {StyleSheet, View} from 'react-native';
import React, {useRef, useState} from 'react';
import {GestureHandlerRootView, ScrollView} from 'react-native-gesture-handler';
import i18n from '../../i18n';
import {TabData} from '../models/TicketReportTabsModel';
import PText from './PText';
import theme from '../theme/theme';
import {converttoTicketTypes} from '../utils/TicketHelper';
import {TicketTypes} from '../models/TicketTypes';

interface TicketReportTabsPro {
  tabs: string[];
  onSelected: (key: string) => void;
  selectedItem: string | undefined;
}
const TicketReportTabs: React.FC<TicketReportTabsPro> = ({
  tabs,
  onSelected,
  selectedItem,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  selectedItem = converttoTicketTypes(selectedItem);
  const [type, setType] = useState(
    selectedItem === undefined ? i18n.t('all') : selectedItem,
  );

  const handleTypeChange = (key: string) => {
    setType(key);
  };
  const isScrollable = tabs.length > 5; // Change the threshold as needed

  const tabData: TabData[] = tabs.map((tab: string) => ({title: String(tab)}));
  const renderTabs = () => {
    return tabData.map((tab, index) => (
      <View key={index} style={styles.tab}>
        <PText
          theme={theme}
          numberOfLines={2}
          style={[
            styles.text,
            type.trim() === tab.title.trim() && styles.selectedItem,
          ]}
          onPress={() => {
            handleTypeChange(tab.title);
            onSelected(tab.title);
          }}>
          {tab.title}
        </PText>
      </View>
    ));
  };

  // Function to scroll to a particular position
  const scrollToView = (index: number) => {
    // Use the ref to call the scrollTo method
    if (scrollViewRef.current) {
      scrollViewRef?.current?.scrollTo({y: index * 150, animated: true}); // Adjust y value as needed
    }
  };
  if (selectedItem) {
    const getIndexByEnumValue = (value: string): number | undefined => {
      const enumKeys = Object.keys(TicketTypes) as Array<
        keyof typeof TicketTypes
      >;
      for (let i = 0; i < enumKeys.length; i++) {
        const key = enumKeys[i];
        let compareString = i18n.t('all');
        compareString = key;
        if (compareString === value) {
          return i;
        }
      }
      return undefined;
    };

    const index: number | undefined = getIndexByEnumValue(type); // 1
    if (index && index >= 2) {
      scrollToView(index);
    }
  }
  return (
    <View style={styles.container}>
      {isScrollable ? (
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}>
          {renderTabs()}
        </ScrollView>
      ) : (
        <View style={styles.tabsContainer}>{renderTabs()}</View>
      )}
    </View>
  );
};
export default TicketReportTabs;

const styles = StyleSheet.create({
  container: {
    marginRight: 110,
  },
  tabsContainer: {
    flexDirection: 'row',
  },
  scrollContainer: {
    flexDirection: 'row',
  },
  tab: {
    borderBottomWidth: 2,
    height: 50,
    paddingLeft: '4%',
    marginTop: 10,
    marginLeft: 10,
    paddingRight: '4%',
    borderBottomColor: 'transparent',
  },

  selectedItem: {
    backgroundColor: theme.colors.primary,
    color: '#fff',
  },
  text: {
    backgroundColor: theme.colors.whitecolor,
    borderRadius: 10,
    padding: 5,
    textAlign: 'center',
    color: theme.colors.primary,
    fontFamily: theme.fonts.regular,
    fontWeight: 'bold',
  },
});
