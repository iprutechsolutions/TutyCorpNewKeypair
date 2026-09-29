import i18n from '../../i18n';
import {Department} from '../models/Department';
import {ResponseModel} from '../models/ResponseModel';
import {TErrorCodes} from '../utils/ErrorCodes';
import api from './api';

export const getDepartments = async (): Promise<
  Department[] | ResponseModel
> => {
  try {
    const response = await api.get('?apicall=department_list');
    const parseCategoriesRes = parseDepartments(response.data.results);
    if (parseCategoriesRes === null) {
      return {
        statusCode: TErrorCodes.CategoryParseError,
        message: i18n.t('department_api_failure'),
      } as ResponseModel;
    } else {
      return parseCategoriesRes as Department[];
    }
  } catch (err) {
    return {
      statusCode: TErrorCodes.CategoryParseError,
      message: i18n.t('department_api_failure'),
    } as ResponseModel;
  }
};

function parseDepartments(
  data: any,
): null | Department[] | PromiseLike<Department[] | null> {
  if (data.length === 0) {
    return [];
  } else if (data?.length === 1) {
    return [
      {
        id: data[0].id,
        name: data[0].name,
      } as Department,
    ];
  } else {
    return data.map((item: any) => {
      return {
        id: item.id,
        name: item.name,
      } as Department;
    });
  }
}
