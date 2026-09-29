import React, {createContext, useState} from 'react';
import {User} from '../models/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {storeUser} from './user';
import {storePreferedLang} from './settings';

interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
  authenticate: (user: User) => void;
  logout: () => void;
  isStaff: boolean;
  username: string | undefined;
  language: string;
}

const defaultAuthValue = {
  user: {} as User,
  isAuthenticated: false,
  authenticate: () => {},
  logout: () => {},
  isStaff: false,
  username: undefined,
  language: 'en',
};

export const AuthContext = createContext<AuthContextType>(defaultAuthValue);

interface AuthContextProviderProps {
  children: React.ReactNode;
}

const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User>();

  function setLanguage(lang: string) {
    AsyncStorage.setItem('language', lang);
  }
  function authenticate(user: User) {
    user.username = user.username;
    if (user?.isStaff) {
      storePreferedLang('en');
    }
    setUser(user);
    storeUser(user);
  }
  function logout() {
    setUser(undefined);
    AsyncStorage.removeItem('user');
  }

  const value = {
    user: user ? user : ({} as User),
    isAuthenticated: !!user,
    authenticate: authenticate,
    logout: logout,
    isStaff: user?.isStaff!,
    username: user?.username,
    language: user?.isStaff ? 'en' : user?.language!,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export default AuthContextProvider;
