export interface Report {
  id: string;
  image?: string;
  submit: boolean;
  location: { latitude: number; longitude: number } | null;
  district: string;
  street: string;
  severity: string;
  date: string;
}
