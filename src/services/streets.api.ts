import i18n from '../../i18n';
import {Street} from '../models/Street';
import {ErrorModel} from '../models/ErrorModel';
import {TErrorCodes} from '../utils/ErrorCodes';
import api from './api';

export const getListOfStreets = async (): Promise<Street[] | ErrorModel> => {
  try {
    const response = await api.get('?apicall=street_list');
    const parsedStreets = parseStreets(response.data.results);
    if (parsedStreets === null) {
      return {
        statusCode: TErrorCodes.StreetParseError,
        message: i18n.t('street_api_failure'),
      } as ErrorModel;
    } else {
      return parsedStreets as Street[];
    }
  } catch (err) {
    return {
      statusCode: TErrorCodes.StreetParseError,
      message: i18n.t('street_api_failure'),
    } as ErrorModel;
  }
};
function parseStreets(
  data: any,
): null | Street[] | PromiseLike<Street[] | null> {
  if (data?.length === 0) {
    return [];
  } else if (data?.length === 1) {
    return [
      {
        streetId: data[0].id,
        streetName: data[0].street_name,
      } as Street,
    ];
  } else {
    return data.map((item: any) => {
      return {
        streetId: item.id,
        streetName: item.street_name,
      } as Street;
    });
  }
}
