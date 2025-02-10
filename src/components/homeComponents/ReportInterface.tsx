export interface Report {
  id: string;
  image: string;
  severity: string;
  coodenates: { latitude: number; longitude: number } | null;
  subregion: string | null;
  district: string | null;
  street: string | null;
  date: string;
  submit: boolean;
}
