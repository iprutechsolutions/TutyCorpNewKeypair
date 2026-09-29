/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useContext, useEffect, useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import SignInScreen from './src/screens/SignInScreen';
import AuthContextProvider, {AuthContext} from './src/store/auth-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoadingScreen from './src/screens/AppLoadingScreen';
import i18n, {changeLanguage} from './i18n';
import {ThemeProvider, useTheme} from './src/theme/ThemeProvider';
import theme from './src/theme/theme';
import {getPreferedLang} from './src/store/settings';
import OTPScreen from './src/screens/OTPScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image} from 'react-native-elements';
import ProfileScreen from './src/screens/ProfileScreen';
import HomeScreen from './src/screens/HomeScreen';
import LogoutScreen from './src/screens/LogoutScreen';
import EditScreen from './src/screens/SupportScreen';
import ToastManager from 'toastify-react-native';
import {
  LogoImg,
  profileImg,
  profileSelImg,
  homeImg,
  logoutImg,
  supportImg,
  supportSelImg,
  homeSelImg,
} from './src/assets';
import FileComplaint from './src/screens/FileComplaint';
import ViewComplaintStatus from './src/screens/ViewComplaintStatus';
import StaffHomeScreen from './src/screens/StaffHomeScreen';
import SupportScreen from './src/screens/SupportScreen';
import CustomBackButton from './src/components/CustomBackButton';
import AutocompleteInput from './src/components/AutocompleteInput';
import ComplaintDetails from './src/screens/ComplaintDetails';

const Stack = createNativeStackNavigator();
const HomeStack = Stack;

const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator
    initialRouteName="Login"
    screenOptions={{
      headerStyle: {backgroundColor: Colors.primary500},
      headerTintColor: 'white',
      contentStyle: {backgroundColor: Colors.primary100},
    }}>
    <Stack.Screen
      name="Login"
      options={{
        headerShown: false,
      }}
      component={SignInScreen}
    />
    <Stack.Screen
      name="OTPScreen"
      component={OTPScreen}
      options={{
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

const HomeScreenStack = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name={i18n.t('home')}
      component={HomeScreen}
      options={{
        headerShown: false,
      }}
    />
  </HomeStack.Navigator>
);

const StaffHomeScreenStack = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="StaffHomeScreen"
      component={StaffHomeScreen}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack.Screen
      name="ListComplaints"
      component={ViewComplaintStatus}
      options={{
        headerStyle: {backgroundColor: theme.colors.primary},
        headerTintColor: theme.colors.whitecolor,
        headerTitle: i18n.t('view_status'),
        headerTitleAlign: 'center',
        headerTitleStyle: {fontFamily: theme.fonts.bold},
        headerLeft: undefined,
      }}
    />
  </HomeStack.Navigator>
);

const HomeScreenTabs = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        options={{
          headerShown: false,
        }}
        component={MainStack}
      />
      <Stack.Screen
        name="AutoCompleteSearch"
        component={AutocompleteInput}
        options={{
          headerStyle: {backgroundColor: theme.colors.primary},
          headerTintColor: theme.colors.whitecolor,
          headerTitle: i18n.t('search_street_name'),
          headerTitleAlign: 'center',
          headerTitleStyle: {fontFamily: theme.fonts.bold},
          headerLeft: () => undefined,
        }}
      />
      <Stack.Screen
        name="FileComplaint"
        component={FileComplaint}
        options={{
          headerStyle: {backgroundColor: theme.colors.primary},
          headerTintColor: theme.colors.whitecolor,
          headerTitle: i18n.t('fileacomplaint'),
          headerTitleAlign: 'center',
          headerTitleStyle: {fontFamily: theme.fonts.bold},
          headerLeft: undefined,
        }}
      />

      <HomeStack.Screen
        name="ListComplaints"
        component={ViewComplaintStatus}
        options={{
          headerStyle: {backgroundColor: theme.colors.primary},
          headerTintColor: theme.colors.whitecolor,
          headerTitle: i18n.t('view_status'),
          headerTitleAlign: 'center',
          headerTitleStyle: {fontFamily: theme.fonts.bold},
          headerLeft: undefined,
        }}
      />
      <HomeStack.Screen
        name="ComplaintDetails"
        component={ComplaintDetails}
        options={{
          headerStyle: {backgroundColor: theme.colors.primary},
          headerTintColor: theme.colors.whitecolor,
          headerTitle: i18n.t('ticket_details'),
          headerTitleAlign: 'center',
          headerTitleStyle: {fontFamily: theme.fonts.bold},
          headerLeft: undefined,
        }}
      />
    </Stack.Navigator>
  );
};

const MainStack = () => {
  const theme = useTheme();
  const authCtx = useContext(AuthContext);
  const isStaff = authCtx?.isStaff;
  return (
    <View style={{flex: 1}}>
      <Tab.Navigator
        screenOptions={({route}) => ({
          activeTintColor: 'blue',
          inactiveTintColor: 'gray',
          tabBarHideOnKeyboard: true,
          tabBarLabel: '',
          showLabel: false, // Hide tab bar item titles
          tabBarIcon: ({focused, color, size}) => {
            let iconName = homeSelImg;
            if (route.name === 'HomeScreenTab') {
              iconName = focused ? homeSelImg : homeImg;
            } else if (route.name === i18n.t('profile')) {
              iconName = focused ? profileSelImg : profileImg;
            } else if (route.name === i18n.t('support')) {
              iconName = focused ? supportSelImg : supportImg;
            } else if (route.name === i18n.t('logout')) {
              iconName = focused ? logoutImg : logoutImg;
            }
            return (
              <Image
                source={iconName ? iconName : homeImg}
                style={{width: size, height: size}}
              />
            );
          },
        })}>
        <Tab.Screen
          name="HomeScreenTab"
          component={!isStaff ? HomeScreenStack : StaffHomeScreenStack}
          options={{
            headerShown: false,
            headerTitleStyle: {fontFamily: theme.fonts.bold},
          }}
        />
        <Tab.Screen
          name={i18n.t('profile')}
          component={ProfileScreen}
          options={{
            headerStyle: {backgroundColor: theme.colors.primary},
            headerTintColor: 'white',
            headerTitle: i18n.t('profile'),
            headerTitleStyle: {fontFamily: 'Poppins-Bold'},
            headerTitleAlign: 'center',
            headerLeft: undefined,
          }}
        />
        <Tab.Screen
          name={i18n.t('support')}
          component={SupportScreen}
          options={{
            headerStyle: {backgroundColor: theme.colors.primary},
            headerTintColor: theme.colors.whitecolor,
            headerTitle: i18n.t('support'),
            headerTitleAlign: 'center',
            headerTitleStyle: {fontFamily: theme.fonts.bold},
            headerLeft: undefined,
          }}
        />

        <Tab.Screen
          name={i18n.t('logout')}
          component={LogoutScreen}
          options={{
            headerStyle: {backgroundColor: theme.colors.primary},
            headerTintColor: 'white',
            headerTitle: i18n.t('logout'),
            headerTitleStyle: {fontFamily: 'Poppins-Bold'},
            headerTitleAlign: 'center',
            headerLeft: undefined,
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

function Navigation() {
  const authCtx = useContext(AuthContext);
  return (
    <NavigationContainer>
      {!authCtx?.isAuthenticated && <AuthStack />}
      <ToastManager
        position="top"
        textStyle={styles.toastStyle}
        duration={5000} // Change duration if needed
        style={{width: '100%'}}
      />
      {authCtx?.isAuthenticated && authCtx.isStaff && <HomeScreenTabs />}
      <ToastManager
        position="top"
        textStyle={styles.toastStyle}
        duration={5000} // Change duration if needed
        style={{width: '100%'}}
      />
      {authCtx?.isAuthenticated && !authCtx.isStaff && <HomeScreenTabs />}
      <ToastManager
        position="top"
        textStyle={styles.toastStyle}
        duration={5000} // Change duration if needed
        style={{width: '100%'}}
      />
    </NavigationContainer>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
      const userObj = await AsyncStorage.getItem('user');
      if (userObj !== null && userObj !== undefined) {
        authCtx?.authenticate(JSON.parse(userObj));
      } else {
        authCtx?.logout();
      }

      setIsTryingLogin(false);
    }

    fetchToken();
  }, [authCtx.language]); // Need to check for this

  if (isTryingLogin) {
    return <AppLoadingScreen />;
  }

  return <Navigation />;
}

function App(): React.JSX.Element {
  (async () => {
    changeLanguage(await getPreferedLang());
  })();
  return (
    <ThemeProvider theme={theme}>
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastStyle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
});
export default App;
