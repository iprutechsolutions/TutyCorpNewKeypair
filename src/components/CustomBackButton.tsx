import React from 'react';
import {TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {backImg} from '../assets';

const CustomBackButton = () => {
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <TouchableOpacity onPress={handleBack}>
      {/* Your custom back button icon */}
      <Image source={backImg} style={{width: 10, height: 20}} />
    </TouchableOpacity>
  );
};

export default CustomBackButton;
