export interface TicketRequest {
  ASSN_STREET: string;
  ASSN_ZONE: number;
  ASSN_WARD: number;
  ASSN_LOCATION: string;
  COMP_MOB: string;
  COMP_EMAIL: string;
  DEPT_NAME: number;
  DEPT_CAT: number;
  DEPT_DESCRIPTION: number;
  lat: string;
  lng: string;
  source: string;
}

export const sampleRequest = {
  ASSN_NO: '- N.A -',
  ASSN_STREET: 'Shunmugapuram Proper',
  ASSN_ZONE: 1,
  ASSN_WARD: 41,
  ASSN_LOCATION: 'Keela shanmugapuram',
  COMP_MOB: '9843412669',
  COMP_EMAIL: '',
  DEPT_NAME: 3,
  DEPT_CAT: 1,
  DEPT_DESCRIPTION: 7,
  ASSIGN_PERSON: 1,
  REPORT: 1,
  PRE_REPORT: 1,
  SLA: '168:00:00',
  lat: '8.79151048517614',
  lng: '78.13148213929234',
  ipaddress: '192.168.127.12',
  source: 'Mobile',
} as TicketRequest;
