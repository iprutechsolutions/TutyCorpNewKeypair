import i18n from '../../i18n';
import {TicketTypes} from '../models/TicketTypes';

export const converttoTicketTypes = (item: string | undefined) => {
  switch (item) {
    case TicketTypes.ALL:
      return i18n.t('all');
    case TicketTypes.OPEN:
      return i18n.t('open');
    case TicketTypes.INPROGRESS:
      return i18n.t('inprogress');
    case TicketTypes.CLOSED:
      return i18n.t('closed');
  }
};
