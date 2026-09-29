import i18n from '../../i18n';
import {Ward} from '../models/Ward';
import {ErrorModel} from '../models/ErrorModel';
import {TErrorCodes} from '../utils/ErrorCodes';
import api from './api';

export const getWardsByStreetId = async (
  streetId: number,
): Promise<Ward[] | ErrorModel> => {
  try {
    const response = await api.post('?apicall=ward_list', {Id: streetId});
    const parsedStreets = parseWards(response.data.results);
    if (parsedStreets === null) {
      return {
        statusCode: TErrorCodes.StreetParseError,
        message: i18n.t('ward_api_failure'),
      } as ErrorModel;
    } else {
      return parsedStreets as Ward[];
    }
  } catch (err) {
    return {
      statusCode: TErrorCodes.StreetParseError,
      message: i18n.t('ward_api_failure'),
    } as ErrorModel;
  }
};
function parseWards(data: any): null | Ward[] | PromiseLike<Ward[] | null> {
  if (data.length === 0) {
    return [];
  } else if (data?.length === 1) {
    return [
      {
        id: data[0].ward,
        name: data[0].ward_name,
      } as Ward,
    ];
  } else {
    return data.map((item: any) => {
      return {
        id: item.ward,
        name: item.ward_name,
      } as Ward;
    });
  }
}
