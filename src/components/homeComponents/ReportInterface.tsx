export interface Report {
  id: string;
  image: string;
  severity: string;
  coodenates?: { latitude: string; longitude: string };
  subregion?: string;
  address?: string;
  geohash?: string;
  district?: string;
  street?: string;
  date: string;
  submit: boolean;
}
