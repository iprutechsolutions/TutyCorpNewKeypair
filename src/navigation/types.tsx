import type {CompositeScreenProps} from '@react-navigation/native';
import type {StackScreenProps} from '@react-navigation/stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {Street} from '../models/Street';
import {Complaint} from '../models/Complaint';
import {User} from '../models/User';

export type RootStackParamList = {
  Login: undefined;
  OTPScreen: {isStaff: boolean};
  HomeScreen: undefined;
  HomeScreenTabs: undefined;
  FileComplaint: undefined;
  ListComplaints: {defaultFilter: string; allticketcount: number};
  HomeScreenTab: undefined;
  ComplaintDetails: {
    complaint: Complaint;
    user: User;
  };
  AutoCompleteSearch: {
    streets: Street[];
    onSelect: (item: Street) => void;
  };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

export type HomeTabParamList = {
  isLogin: undefined;
  Latest: undefined;
};

export type HomeTabScreenProps<T extends keyof HomeTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<HomeTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
