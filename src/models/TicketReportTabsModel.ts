// Define the common interface for tab data
export interface TabData {
  title: string;
}

// Define types for different kinds of inputs
export type TicketReportTabs = {
  type: 'string';
  tabs: string[];
};
