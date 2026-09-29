export interface SelectedAssessmentDetails {
  streetId: number;
  streetName: string;
  ward: {id: number; name: string};
  zone: {id: number; name: string};
  address: string;
}
