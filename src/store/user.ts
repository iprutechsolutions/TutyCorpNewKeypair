import AsyncStorage from '@react-native-async-storage/async-storage';
import {User} from '../models/User';

export const getUserFromStorage = async (): Promise<User | null> => {
  try {
    // Read the user model from AsyncStorage
    const userString = await AsyncStorage.getItem('user');

    // If userString is null (no user found), return null
    if (!userString) {
      return null;
    }

    // Parse the JSON string to get the user object
    const user: User = JSON.parse(userString);

    return user;
  } catch (error) {
    console.error('Error reading user from AsyncStorage:', error);
    throw error;
  }
};

export const storeUser = async (user: User): Promise<User | null> => {
  try {
    // Read the user model from AsyncStorage
    await AsyncStorage.setItem('user', JSON.stringify(user));
    return user;
  } catch (error) {
    console.error('Error storing user into AsyncStorage:', error);
    throw error;
  }
};

export const storePushToken = async (
  token: string,
  osType: string,
): Promise<string | null> => {
  try {
    // Read the user model from AsyncStorage
    await AsyncStorage.setItem('token', JSON.stringify({token, osType}));
    return token;
  } catch (error) {
    console.error('Error storing token into AsyncStorage:', error);
    throw error;
  }
};

export const isTokenRegistered = async (): Promise<boolean | null> => {
  try {
    // Read the user model from AsyncStorage
    const token = await AsyncStorage.getItem('token');

    // If userString is null (no user found), return null
    if (!token) {
      return null;
    }

    // Parse the JSON string to get the user object
    const tokenObj: {token: string; osType: string} = JSON.parse(token);

    return tokenObj?.token != null ? true : false;
  } catch (error) {
    console.error('Error reading token from AsyncStorage:', error);
    throw error;
  }
};

export const getPushTokenInfo = async (): Promise<{
  token: string;
  osType: string;
} | null> => {
  try {
    // Read the user model from AsyncStorage
    const pushToken = await AsyncStorage.getItem('token');

    // If userString is null (no user found), return null
    if (!pushToken) {
      return null;
    }

    // Parse the JSON string to get the user object
    const token: {token: string; osType: string} = JSON.parse(pushToken);

    return token;
  } catch (error) {
    console.error('Error reading push token from AsyncStorage:', error);
    throw error;
  }
};
