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

// Generic function to handle API calls
export async function makeApiRequest(
  urlPath:
    | 'sendSMSNotification'
    | 'sendAlertPushNotification'
    | 'sendSurveyPushNotification',
  data: SMSAlertData | PushNotificationData | SurveyPushNotificationData
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
