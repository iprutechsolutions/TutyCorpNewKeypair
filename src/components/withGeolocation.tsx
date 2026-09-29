import React, {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const withGeolocation = WrappedComponent => {
  const WithGeolocation = props => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [permissionGiven, setPermissionGiven] = useState(false);

    useEffect(() => {
      const requestLocationPermission = async () => {
        try {
          if (Platform.OS === 'android') {
            Geolocation.requestAuthorization(
              () => {
                setPermissionGiven(permissionGiven);
                getCurrentLocation()
                  .then(position => {
                    setLocation(position);
                    JSON.stringify(position);
                  })
                  .catch(error => {});
              },
              () => {},
            );
          }
        } catch (err) {
          console.warn(err);
        }
      };

      requestLocationPermission();
    }, [permissionGiven]);
    const getCurrentLocation = () => {
      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          position => resolve(position.coords),
          error => reject(error),
          {enableHighAccuracy: true},
        );
      });
    };
    return (
      <WrappedComponent {...props} location={location} errorMsg={errorMsg} />
    );
  };

  return WithGeolocation;
};

export default withGeolocation;
