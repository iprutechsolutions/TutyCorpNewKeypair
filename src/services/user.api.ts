import i18n from '../../i18n';
import {ResponseModel} from '../models/ResponseModel';
import {User} from '../models/User';
import {getUserFromStorage, storeUser} from '../store/user';
import {TErrorCodes} from '../utils/ErrorCodes';
import api from './api';

export const updateUser = async (
  email: string,
  username: string,
  authContext: any,
): Promise<ResponseModel> => {
  const user = await getUserFromStorage();
  const request = {
    user_name: username,
    user_phone: user?.phone,
    user_email: email,
    user_id: user?.ID,
    user_token: user?.token,
    device_id: 'dummyId',
  };
  try {
    const response = await api.post('/?apicall=user_creation', request);
    if (!response.data.error) {
      const newUser = {
        username: request.user_name,
        email: request.user_email,
        phone: user?.phone,
        ID: user?.ID,
        token: user?.token,
      } as User;
      authContext.authenticate(newUser);
      const response = await storeUser(newUser);

      return {
        statusCode: TErrorCodes.PROFILE_UPDATE_SUCCESS,
        message: i18n.t('profile_udpate_success'),
      };
    } else {
      return {
        statusCode: TErrorCodes.PROFILE_UPDATE_FAILED,
        message: i18n.t('profile_update_failed'),
      };
    }
  } catch (err) {
    return {
      statusCode: TErrorCodes.PROFILE_UPDATE_FAILED,
      message: i18n.t('profile_update_failed'),
    };
  }
};
