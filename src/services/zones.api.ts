import i18n from '../../i18n';
import {ErrorModel} from '../models/ErrorModel';
import {TErrorCodes} from '../utils/ErrorCodes';
import api from './api';
import {Zone} from '../models/Zone';

export const getZonesByWardId = async (
  wardId: number,
): Promise<Zone[] | ErrorModel> => {
  try {
    const response = await api.post('?apicall=zone_list', {Id: wardId});
    const parsedStreets = parseZones(response.data.results);
    if (parsedStreets === null) {
      return {
        statusCode: TErrorCodes.StreetParseError,
        message: i18n.t('zone_api_failure'),
      } as ErrorModel;
    } else {
      return parsedStreets as Zone[];
    }
  } catch (err) {
    return {
      statusCode: TErrorCodes.StreetParseError,
      message: i18n.t('zone_api_failure'),
    } as ErrorModel;
  }
};
function parseZones(data: any): null | Zone[] | PromiseLike<Zone[] | null> {
  if (data.length === 0) {
    return [];
  } else if (data?.length === 1) {
    return [
      {
        id: data[0].zone,
        name: data[0].zone_name,
      } as Zone,
    ];
  } else {
    return data.map((item: any) => {
      return {
        id: item.zone,
        name: item.zone_name,
      } as Zone;
    });
  }
}
