import i18n from '../../i18n';
import {ErrorModel} from '../models/ErrorModel';
import {TErrorCodes} from '../utils/ErrorCodes';
import api from './api';
import {Assessment} from '../models/Assessment';

export const getAsessmentsList = async (): Promise<
  Assessment[] | ErrorModel
> => {
  try {
    const response = await api.get('?apicall=assessment_list');
    const parsedStreets = parseStreets(response.data.results);
    if (parsedStreets === null) {
      return {
        statusCode: TErrorCodes.StreetParseError,
        message: i18n.t('assessment_api_failure'),
      } as ErrorModel;
    } else {
      return parsedStreets as Assessment[];
    }
  } catch (err) {
    return {
      statusCode: TErrorCodes.StreetParseError,
      message: i18n.t('assessment_api_failure'),
    } as ErrorModel;
  }
};
function parseStreets(
  data: any,
): null | Assessment[] | PromiseLike<Assessment[] | null> {
  if (data?.length === 0) {
    return [];
  } else if (data?.length === 1) {
    return [
      {
        assesmentNo: data[0].assesmentNo,
        zone: data[0].zone,
        zone_name: data[0].zone_name,
        wardNo: data[0].wardNo,
        ward_name: data[0].ward_name,
        door: data[0].door,
        street: data[0].street,
        streetNo: data[0].street_id,
        address: data[0].address,
      } as Assessment,
    ];
  } else {
    return data.map((item: any) => {
      return {
        assesmentNo: item.assesmentNo,
        zone: item.zone,
        zone_name: item.zone_name,
        wardNo: item.wardNo,
        ward_name: item.ward_name,
        door: item.door,
        street: item.street,
        streetNo: item.street_id,
        address: item.address,
      } as Assessment;
    });
  }
}
