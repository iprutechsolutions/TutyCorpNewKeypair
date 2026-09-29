import api from './api';

export const getImagesByTicketId = async (
  ticketId: string | number,
): Promise<string[] | null> => {
  const request = {ticket_id: ticketId};
  try {
    const response = await api.post('/?apicall=ticket_image', request);
    return response?.data?.results?.map((result: any) => result.images);
  } catch (err) {
    return null;
  }
};
