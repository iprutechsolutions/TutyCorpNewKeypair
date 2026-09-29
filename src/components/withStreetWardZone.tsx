import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getListOfStreets} from '../services/streets.api';
import {Street} from '../models/Street';
import {ErrorModel} from '../models/ErrorModel';
import {Ward} from '../models/Ward';
import {Zone} from '../models/Zone';
import withGeolocation from './withGeolocation';

const withStreetWardAndZones = WrappedComponent => {
  const withStreetWardAndZone = props => {
    const [selectedStreetId, setSelectedStreetId] = useState(-1);
    const [selectedWardId, setSelectedWardId] = useState(-1);
    const [streets, setStreets] = useState<Street[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [zones, setZones] = useState<Zone[]>([]);

    // Fetch initial data from local storage on component mount
    useEffect(() => {
      fetchDataFromStorage();
      fetchStreets();
    }, []);

    const fetchDataFromStorage = async () => {
      try {
        const localData = await AsyncStorage.getItem('streets');
        if (localData !== null) {
          setStreets(JSON.parse(localData));
        }
      } catch (error) {
        console.error('Error fetching data from local storage:', error);
      }
    };

    const fetchStreets = async () => {
      try {
        // Make API call to fetch data
        const response: Street[] | ErrorModel = await getListOfStreets();
        // Update local data with data fetched from API
        if ('statusCode' in response && 'message' in response) {
        } else {
          setStreets(response);

          // Save updated data to local storage
          await AsyncStorage.setItem('streets', JSON.stringify(response));
        }
      } catch (error) {
        console.error('Error fetching data from API:', error);
      }
    };

    const handleStreetSelection = (street: Street) => {
      setSelectedStreetId(street?.streetId);
      if (selectedStreetId !== -1) {
        setWards(
          streets
            .filter((item: Street) => item.streetId === street.streetId)
            .map((item: Street) => item.ward),
        );
      }
    };
    const handledWardSelection = (ward: Ward) => {
      setSelectedWardId(ward?.wardId);
      if (selectedWardId !== -1) {
        setZones(
          streets
            .filter((item: Street) => item.ward.wardId === ward.wardId)
            .map((item: Street) => item.zone),
        );
      }
    };
    return (
      //Fetching Districts and Blocks Fail case needs to be handled
      <WrappedComponent
        onStreetSelected={handleStreetSelection}
        onWardSelected={handledWardSelection}
        {...props}
        streets={streets}
        wards={wards}
        zones={zones}
      />
    );
  };
  return withStreetWardAndZone;
};

export default withStreetWardAndZones;
