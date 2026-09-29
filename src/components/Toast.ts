import {Toast} from 'toastify-react-native';

export const showSuccessToast = (message: string) => {
  Toast.success(message);
};

export const showFailureToast = (message: string) => {
  Toast.error(message, 'top');
};

export const showInfoToast = (message: string) => {
  Toast.info(message, 'top');
};
