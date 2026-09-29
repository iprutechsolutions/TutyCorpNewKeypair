import {HttpStatusCode} from 'axios';
import {TErrorCodes} from '../utils/ErrorCodes';
import i18n from '../../i18n';
import {ErrorModel} from '../models/ErrorModel';
import api from './api';
import {FileItem} from '../models/FileItem';
import {Complaint} from '../models/Complaint';
import {ResponseModel} from '../models/ResponseModel';
import {TicketCounts} from '../models/TicketCounts';
import {ComplaintHistory} from '../models/ComplaintHistoryModel';

export const createTicket = async (
  ticket: any,
  files: FileItem[],
): Promise<ResponseModel> => {
  try {
    const formData = new FormData();
    if (files) {
      files.forEach(item => {
        formData.append('images[]', item);
      });
    }
    Object.entries(ticket).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const response = await api.post('?apicall=ticket_creation', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Set the content type to multipart/form-data
      },
    });
    if (response?.status !== HttpStatusCode.Ok) {
      return {
        statusCode: TErrorCodes.CreateTicketFailed,
        message: i18n.t('ticket_create_api_failure'),
      } as ResponseModel;
    } else {
      return {
        statusCode: TErrorCodes.TICKET_CREATED_SUCCESSFULLY,
        message: response?.data?.user?.ticket_id,
      } as ResponseModel;
    }
  } catch (err) {
    return {
      statusCode: TErrorCodes.CreateTicketFailed,
      message: i18n.t('ticket_create_api_failure'),
    } as ResponseModel;
  }
};

export const getComplaints = async (
  phoneNumber: string | undefined,
): Promise<ErrorModel | Complaint[]> => {
  if (!phoneNumber) {
    return [];
  }

  const request = {
    COMP_MOB: phoneNumber,
  };
  try {
    const response = await api.post('/?apicall=ticket_list', request);
    return parseComplaintResponse(response);
  } catch (err) {
    return {statusCode: 404, message: 'Failed'} as ErrorModel;
  }
};

export const getStaffComplaintsList = async (
  empId: number,
  page: number,
  filter: string,
): Promise<ErrorModel | Complaint[]> => {
  if (!empId) {
    return [];
  }

  const request = {
    id: empId,
    limit: page * 20,
    offset: 20,
    status: filter === 'All' ? '' : filter,
  };
  try {
    const response = await api.post('/?apicall=allempticket_list', request);
    return parseComplaintResponse(response);
  } catch (err) {
    return {statusCode: 404, message: 'Failed'} as ErrorModel;
  }
};

export const getTicketsCount = async (phoneNumber: string) => {
  const request = {
    phoneNumber,
  };
  const response = await api.post(
    '/?apicall=ticket_count_with_mobile',
    request,
  );
  return response;
};

const parseComplaintResponse = (response: any): Complaint[] => {
  if (response?.status !== HttpStatusCode.Ok) {
    return [];
  }
  const complaints = response?.data?.results;
  if (!complaints) {
    return [];
  }
  return complaints;
};
export const updateTicket = async (request: any, files: FileItem[]) => {
  const formData = new FormData();
  if (files) {
    files.forEach(item => {
      formData.append('images[]', item);
    });
  }
  Object.entries(request).forEach(([key, value]) => {
    formData.append(key, value);
  });
  const response = await api.post('?apicall=ticket_update', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Set the content type to multipart/form-data
    },
  });
  if (response?.status !== HttpStatusCode.Ok) {
    return {
      statusCode: TErrorCodes.TICKET_UPDATED_FAILED,
      message: i18n.t('ticket_update_api_failure'),
    } as ResponseModel;
  } else {
    return {
      statusCode: TErrorCodes.TICKET_UPDATED_SUCCESSFULLY,
      message: i18n.t('ticket_updated_successfully'),
    } as ResponseModel;
  }
};
export const getTicketsCountForStaff = async (
  empId: number,
  role = 'emp',
): Promise<TicketCounts | ErrorModel> => {
  const request = {
    emp_id: empId,
    role,
  };
  try {
    const response = await api.post(
      '/?apicall=ticket_count_with_staff',
      request,
    );
    return {
      error: response.data.error,
      message: response.data.message,
      open: response.data.open,
      Ongoing: response.data.Ongoing,
      Closed: response.data.Closed,
      total: response.data.total,
    } as TicketCounts;
  } catch (err) {
    return {
      statusCode: TErrorCodes.STAFF_TICKET_COUNT_FAILED,
      message: 'Failed',
    } as ErrorModel;
  }
};

export const getTicketHistory = async (
  ticktId: string,
): Promise<ComplaintHistory[] | ResponseModel> => {
  const request = {ticket_id: ticktId};
  try {
    const response = await api.post('/?apicall=ticket_history', request);
    return parseHistoryResponse(response.data.results);
  } catch (err) {
    return {
      statusCode: TErrorCodes.TICKET_HISTORY_FAILED,
      message: 'Failed',
    } as ResponseModel;
  }
};

const parseHistoryResponse = (response: any): ComplaintHistory[] => {
  if (response?.length <= 0) {
    return [];
  }
  const complaints = response.map(item => {
    return {
      ticket_id: item.ticket_id,
      remark: item.remark,
      emp_name: item.emp_name,
      date_created: item.date_created,
    } as ComplaintHistory;
  });
  return complaints;
};

export const reassignTicket = async (request: any) => {
  try {
    const response = await api.post('?apicall=ticket_reassign', request);
    if (response.data.error) {
      return {
        statusCode: TErrorCodes.TICKET_REASSIGN_FAILED,
        message: i18n.t('reassign_failed'),
      } as ResponseModel;
    } else {
      return {
        statusCode: TErrorCodes.TICKET_REASSIGN_SUCCESS,
        message: response?.data?.user?.ticket_id,
      } as ResponseModel;
    }
  } catch (err) {
    return {
      statusCode: TErrorCodes.TICKET_REASSIGN_FAILED,
      message: i18n.t('reassign_failed'),
    } as ResponseModel;
  }
};
