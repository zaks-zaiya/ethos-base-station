import { defineStore } from 'pinia';
import { useDataUserStore } from 'src/stores/dataUser';
import { RiskLevel } from 'src/typings/data-types';
import { makeApiRequest } from 'src/helpers/server';

interface PhoneNumberState {
  isSmsNotificationsEnabled: boolean;
  phoneNumbers: string[];
}

function parseAustralianPhoneNumber(phoneNumber: string) {
  // Remove all non-numeric characters (except '+')
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');

  // Handle phone numbers starting with '+61'
  if (cleaned.startsWith('+61')) {
    return cleaned;
  }

  // Handle phone numbers starting with '61'
  if (cleaned.startsWith('61')) {
    return '+' + cleaned;
  }

  // Handle phone numbers starting with '04' (convert to '+614')
  if (cleaned.startsWith('04')) {
    return '+61' + cleaned.slice(1);
  }

  // Handle phone numbers starting with just 4
  if (cleaned.startsWith('4')) {
    return '+61' + cleaned;
  }

  // Default case: if the input doesn't match any expected format, return null
  return null;
}

export const useDataPhoneNumberStore = defineStore('dataPhoneNumber', {
  state: (): PhoneNumberState => ({
    isSmsNotificationsEnabled: false,
    phoneNumbers: [''],
  }),

  getters: {
    getParsedPhoneNumbers(): (string | null)[] {
      return this.phoneNumbers.map((number) =>
        parseAustralianPhoneNumber(number)
      );
    },
  },

  actions: {
    addPhoneNumber(phoneNumber: string) {
      this.phoneNumbers.push(phoneNumber);
    },

    removePhoneNumber(index: number) {
      this.phoneNumbers.splice(index, 1);
    },

    updatePhoneNumber(index: number, phoneNumber: string) {
      this.phoneNumbers[index] = phoneNumber;
    },

    async sendSmsNotifications(roomName: string, severity: RiskLevel) {
      if (!this.isSmsNotificationsEnabled) {
        return;
      }

      const { id } = useDataUserStore();
      if (!id) {
        console.warn('User ID undefined');
        return;
      }

      let severityString: 'medium' | 'high' = 'medium';
      if (severity === RiskLevel.LOW) {
        // Dont send alert
        console.warn('Trying to send text message alert at low severity');
        return;
      } else if (severity === RiskLevel.MEDIUM) {
        severityString = 'medium';
      } else if (severity === RiskLevel.HIGH) {
        severityString = 'high';
      } else {
        console.error('Invalid severity level passed to sms notifications');
        return;
      }

      const validPhoneNumbers = this.getParsedPhoneNumbers.filter(
        (number): number is string => number !== null
      );

      for (const phoneNumber of validPhoneNumbers) {
        const result = await makeApiRequest('sendSMSNotification', {
          userId: id.toString(),
          phoneNumber,
          roomName,
          severity: severityString,
        });
        if (result) {
          console.log(`Alert sent to ${phoneNumber}`);
        } else {
          console.error(`Failed to send alert to ${phoneNumber}`);
        }
      }
    },

    checkPhoneNumber(phoneNumber: string): boolean | string {
      // Parse the phone number into a standardized format
      const parsedNumber = parseAustralianPhoneNumber(phoneNumber);
      // Define regex to check if parsed number is valid
      const validPhoneNumberRegex = /^\+614\d{8}$/; // Should be +614 followed by 8 digits

      if (!parsedNumber || !validPhoneNumberRegex.test(parsedNumber)) {
        // Invalid number
        return 'Invalid phone number';
      }

      return true;
    },

    async sendAlertPushNotifications(roomName: string, severity: RiskLevel) {
      const { id } = useDataUserStore();
      if (!id) {
        console.warn('User ID undefined');
        return;
      }

      let severityString: 'medium' | 'high' = 'medium';
      if (severity === RiskLevel.LOW) {
        console.warn('Trying to send push notification at low severity');
        return;
      } else if (severity === RiskLevel.MEDIUM) {
        severityString = 'medium';
      } else if (severity === RiskLevel.HIGH) {
        severityString = 'high';
      } else {
        console.error('Invalid severity level passed to push notifications');
        return;
      }

      const result = await makeApiRequest('sendAlertPushNotification', {
        identity: id.toString(),
        roomName,
        severity: severityString,
      });
      if (result) {
        console.log('Push notification sent');
      } else {
        console.error('Failed to send push notification');
      }
    },

    async sendSurveyNotification(surveyType: 'bom' | 'alert' | 'both') {
      const { id, isPhoneAppGroup } = useDataUserStore();
      if (!isPhoneAppGroup) {
        console.warn(
          'Not in phone app group, not sending survey push notification'
        );
      }
      if (!id) {
        console.warn('User ID undefined');
        return;
      }

      const result = await makeApiRequest('sendSurveyPushNotification', {
        identity: id.toString(),
        surveyType,
      });
      if (result) {
        console.log(`Survey notification sent for ${surveyType} survey(s)`);
      } else {
        console.error(
          `Failed to send survey notification for ${surveyType} survey(s)`
        );
      }
    },

    async sendFitbitNotification() {
      const { id } = useDataUserStore();
      if (!id) {
        console.warn('User ID undefined');
        return;
      }

      const result = await makeApiRequest('sendFitbitPushNotification', {
        identity: id.toString(),
      });
      if (result) {
        console.log('Fitbit notification sent!');
      } else {
        console.error('Failed to send fitbit notification');
      }
    },
  },
});
