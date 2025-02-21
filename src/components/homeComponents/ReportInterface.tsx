export interface Report {
  id: string;
  image: string;
  severity: number;
  coodenates?: { latitude: string; longitude: string };
  subregion?: string;
  address?: string;
  geohash?: string;
  district?: string;
  street?: string;
  status?: number;
  date: string;
  submit: boolean;
}
