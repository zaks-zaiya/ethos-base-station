import { useDataUserStore } from 'src/stores/dataUser';

interface SMSAlertData {
  userId: string;
  phoneNumber: string;
  roomName: string;
  severity: 'medium' | 'high';
}

interface PushNotificationData {
  identity: string;
  roomName: string;
  severity: 'medium' | 'high';
}

interface SurveyPushNotificationData {
  identity: string;
  surveyType: 'bom' | 'alert' | 'both';
}

interface FitbitPushNotificationData {
  identity: string;
}

interface UserSurveyData {
  newValue: boolean;
}

export async function makeApiRequest(
  urlPath:
    | 'sendSMSNotification'
    | 'sendAlertPushNotification'
    | 'sendSurveyPushNotification'
    | 'sendFitbitPushNotification'
    | 'displayUserHeatSurvey'
    | 'displayUserBomSurvey',
  data:
    | SMSAlertData
    | PushNotificationData
    | SurveyPushNotificationData
    | FitbitPushNotificationData
    | UserSurveyData
): Promise<string | null> {
  const url = `https://${process.env.COUCH_DB_URL}/server/${urlPath}`;
  const dataUserStore = useDataUserStore();

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(
          `${dataUserStore.id}:${dataUserStore.password}`
        )}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.text();
    console.log(result);
    return result;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Helper function specifically for updating heat survey display
export async function setDisplayUserHeatSurvey(
  newValue: boolean
): Promise<string | null> {
  return makeApiRequest('displayUserHeatSurvey', { newValue });
}

// Helper function specifically for updating bom survey display
export async function setDisplayUserBomSurvey(
  newValue: boolean
): Promise<string | null> {
  return makeApiRequest('displayUserBomSurvey', { newValue });
}
