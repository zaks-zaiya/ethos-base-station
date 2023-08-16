import { AudioType, RiskLevel } from 'src/typings/data-types';

export interface BaseDatabaseStructure {
  type: 'sensor' | 'weather' | 'preferences' | 'survey' | 'alert';
  time: Date;
  userId: number;
}

export interface SensorDatabaseStructure {
  sensorLocation: string | undefined;
  sensorId: number | undefined;
  temperature: number | undefined;
  humidity: number | undefined;
}

export interface WeatherDatabaseStructure {
  weatherLocation: string;
  temperature: number;
  humidity: number;
}

export interface PreferencesDatabaseStructure {
  audioType: AudioType;
  isFollowUp: boolean;
  coolingStrategyOptions: Array<{
    key: string;
    haveAccessTo: boolean;
    wouldUse: boolean;
    whyNotUse: Array<string>;
    whyNotUseOther: string;
  }>;
}

export interface SurveyDatabaseStructure {
  todo: null;
  // TODO: Fill in rest once questions finalized
}

export interface AlertDatabaseStructure {
  riskLevel: RiskLevel;
  dismissMethod: null | 'not here' | 'cooling strategies' | 'dismiss';
}
