export interface SensorData {
  name: string | undefined;
  id: number | undefined;
  temperature: number | undefined;
  humidity: number | undefined;
  lastSeen: Date | undefined;
}

export interface UserData {
  id: undefined | number;
  postcode: undefined | number;
  latitude: undefined | number;
  longitude: undefined | number;
  ageYears: undefined | number;
  heightCm: undefined | number;
  weightKg: undefined | number;
}

export interface CoolingStrategy {
  text: string;
  imageUrl: string;
  description: string;
}
