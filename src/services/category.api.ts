import i18n from '../../i18n';
import {Category} from '../models/Category';
import {ResponseModel} from '../models/ResponseModel';
import {TErrorCodes} from '../utils/ErrorCodes';
import api from './api';

export const getListOfCategories = async (): Promise<
  Category[] | ResponseModel
> => {
  try {
    const response = await api.get('?apicall=category_list');
    const parseCategoriesRes = parseCategories(response.data.results);
    if (parseCategoriesRes === null) {
      return {
        statusCode: TErrorCodes.CategoryParseError,
        message: i18n.t('category_api_failure'),
      } as ResponseModel;
    } else {
      return parseCategoriesRes as Category[];
    }
  } catch (err) {
    return {
      statusCode: TErrorCodes.CategoryParseError,
      message: i18n.t('category_api_failure'),
    } as ResponseModel;
  }
};

function parseCategories(
  data: any,
): null | Category[] | PromiseLike<Category[] | null> {
  if (data?.length === 0) {
    return [];
  } else if (data?.length === 1) {
    return [
      {
        complaint_cat_name: data[0].complaint_cat_name,
        department_id: data[0].department_id,
        id: data[0].id,
        name: data[0].name,
      } as Category,
    ];
  } else {
    return data.map((item: any) => {
      return {
        complaint_cat_name: item.complaint_cat_name,
        department_id: item.department_id,
        id: item.id,
        name: item.name,
      } as Category;
    });
  }
}
