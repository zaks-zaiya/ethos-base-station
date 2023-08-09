import { RiskLevel } from 'src/components/models';

export interface BaseDatabaseStructure {
  time: Date;
  userId: number;
}

export interface SensorDatabaseStructure {
  type: 'sensor';
  sensorLocation: string;
  sensorId: number;
  temperature: number;
  humidity: number;
}

export interface WeatherDatabaseStructure {
  type: 'weather';
  weatherLocation: string;
  temperature: number;
  humidity: number;
}

export interface PreferencesDatabaseStructure {
  type: 'preferences';
  weatherLocation: string;
  temperature: number;
  humidity: number;
}

export interface SurveyDatabaseStructure {
  type: 'survey';
  // TODO: Fill in rest once questions finalized
}

export interface AlertDatabaseStructure {
  type: 'alert';
  riskLevel: RiskLevel;
  dismissMethod: null | 'not here' | 'cooling strategies' | 'dismiss';
}
