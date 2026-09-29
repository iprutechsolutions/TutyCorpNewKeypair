import {HttpStatusCode} from 'axios';
import api from './api';
import {TErrorCodes} from '../utils/ErrorCodes';
import i18n from '../../i18n';
import {SuccessModel} from '../models/SuccessModel';
import {ErrorModel} from '../models/ErrorModel';
import {ResponseModel} from '../models/ResponseModel';
import {User} from '../models/User';

const sendOtp = async (
  phoneNumber: string,
  isStaff: boolean,
): Promise<ResponseModel> => {
  const request = {
    PhoneNumber: phoneNumber,
    deviceId: 'e334545rffv443',
  };
  const query = isStaff ? 'emploginotp' : 'loginotp';
  const response = await api.post(`?apicall=${query}`, request);
  return parseResponse(response);
};
const parseResponse = (response: any) => {
  if (response?.status === HttpStatusCode.Ok && !response.error) {
    return {
      statusCode: TErrorCodes.OTP_SENT_SUCCESSFULLY,
      message: i18n.t('otp_sent_success'),
    } as SuccessModel;
  } else {
    return {
      statusCode: TErrorCodes.OTP_FAILED,
      message: i18n.t('otp_sent_failed'),
    } as ErrorModel;
  }
};

export const verifyOtp = async (
  phoneNumber: string,
  otp: string,
  isStaff: boolean,
): Promise<User | ErrorModel> => {
  const request = {
    PhoneNumber: phoneNumber,
    OTP: otp,
  };
  const query = isStaff ? 'empverifyotp' : 'verifyotp';
  try {
    const response = await api.post(`?apicall=${query}`, request);
    if (Array.isArray(response.data)) {
      return {
        statusCode: TErrorCodes.OTP_FAILED,
        message: i18n.t('invalid_otp'),
      } as ErrorModel;
    }
    return parseOtpResponse(response.data);
  } catch (err) {
    return {
      statusCode: TErrorCodes.OTP_FAILED,
      message: i18n.t('otp_sent_failed'),
    } as ErrorModel;
  }
};

const parseOtpResponse = (response: any): User | ErrorModel => {
  if (response?.error) {
    return {
      statusCode: TErrorCodes.OTP_FAILED,
      message: i18n.t('invalid_otp'),
    } as ErrorModel;
  }
  return {
    username: response.username,
    token: response.token,
    phone: response.phone,
    ID: response.isStaff ? response.empId : response.ID,
    email: response.email,
    isStaff: response?.isStaff,
    role: response.role,
  } as User;
};
export default sendOtp;
