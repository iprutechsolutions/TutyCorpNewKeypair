import React, {useEffect, useState} from 'react';
import {Button, ScrollView, StatusBar, StyleSheet, View} from 'react-native';
import {Theme, useTheme} from '../theme/ThemeProvider';
import SearchComponent from '../components/SearchComponent';
import AssessmentDetailsInput from './AssessmentDetailsInput';
import {getAsessmentsList} from '../services/assessment.api';
import {showFailureToast} from '../components/Toast';
import {Assessment} from '../models/Assessment';
import i18n from '../../i18n';

const FileComplaint = () => {
  const [search, setSearch] = useState(false);
  const [isSearched, setIsSearched] = useState(false);
  const [assessments, setAssessments] = useState<Assessment[]>();
  const [assessment, setAssessment] = useState<Assessment>();

  const theme = useTheme();
  useEffect(() => {
    (async () => {
      const response = await getAsessmentsList();
      if ('statusCode' in response && 'message' in response) {
        showFailureToast(response.message);
      } else {
        setAssessments(response);
      }
    })();
  }, []);
  useEffect(() => {}, [isSearched]);
  const styles = generateStyles(theme);
  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={theme.colors.primary}
        barStyle={'light-content'}></StatusBar>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <SearchComponent
            theme={theme}
            placeholder={i18n.t('search_for_an_assessment_number')}
            onSearch={async (searchTerm: string) => {
              setSearch(true);
              setIsSearched(!isSearched);
              const obj = assessments?.find(
                assessment => assessment.assesmentNo === searchTerm?.trim(),
              );
              if (obj) {
                setAssessment(obj);
              } else {
                showFailureToast(i18n.t('invalid_assessment_number'));
              }
            }}
          />
          <AssessmentDetailsInput
            assessment={assessment}
            clearSearch={() => {
              setSearch(false);

              setIsSearched(false);
              setAssessment(undefined);
            }}
            theme={theme}></AssessmentDetailsInput>
        </View>
      </ScrollView>
    </View>
  );
};

const generateStyles = (theme: Theme) =>
  StyleSheet.create({
    submitButtonContainer: {
      position: 'absolute',
      bottom: 20, // Adjust this value as needed
      left: 0,
      right: 0,
      paddingHorizontal: 20,
    },
    toastStyle: {
      color: theme.colors.red,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.cream,
    },
  });
export default FileComplaint;
