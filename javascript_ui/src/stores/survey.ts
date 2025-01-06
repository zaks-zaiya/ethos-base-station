import { defineStore } from 'pinia';
import { SurveyDatabaseStructure } from 'src/typings/database-types';
import { useDatabaseStore } from './database';
import { useDataPhoneNumberStore } from './dataPhoneNumberStore';
import { useDataUserStore } from './dataUser';

export const useSurveyStore = defineStore('survey', {
  persist: true,
  state: () => ({
    // Track how many alerts to see if we need to show survey
    alertsSinceLastSurvey: 0,
    // Keep the number of alerts in last time period to display to user
    alertsInLastTimePeriod: 0,

    // Whether there is an active bom alert
    isActiveBomAlert: false,
    // Backup of data for survey to know whether to show BOM questions
    isShowBomQuestions: false,

    // Store when bom survey notification was last sent
    surveyPushNotificationLastSentDate: undefined as undefined | Date,

    // Whether to show the survey modal
    isShowSurveyModal: false,
    // When survey is shown
    surveyDisplayDateString: null as null | string,

    // User answers to survey
    surveyAnswers: {
      wasHomeForEthosAlert: undefined,
      awareOfEthosAlert: undefined,
      awareOfBomAlert: undefined,
      howAwareOfBomAlert: [],
      howAwareOfBomAlertOther: '',
      wasHomeForCooling: undefined,
      coolingStrategiesUsed: [],
      coolingStrategiesUsedOther: '',
      effectivenessOfStrategies: {},
    } as SurveyDatabaseStructure,
  }),
  actions: {
    incrementAlertCount() {
      this.alertsSinceLastSurvey++;
    },
    postSurveyAnswers() {
      const databaseStore = useDatabaseStore();
      databaseStore.postDocument('survey', this.surveyAnswers);
    },
    checkAndDisplaySurvey() {
      const currentDate = new Date();
      const currentHour = currentDate.getHours();
      const ONE_HOUR = 60 * 60 * 1000; // ms
      if (
        currentHour === 19 &&
        (this.alertsSinceLastSurvey > 0 || this.isActiveBomAlert === true)
      ) {
        console.log('Showing survey...');
        // Update when string for when survey sent
        this.surveyDisplayDateString = currentDate.toLocaleDateString();
        /**
         * Note: Not sure why set timeout is needed here but otherwise
         * string does not display on survey
         */
        setTimeout(() => {
          this.surveyDisplayDateString = currentDate.toLocaleDateString();
        }, 10);

        // Store number of alerts
        const alertsInLastTimePeriod = this.alertsSinceLastSurvey;
        // Store current bom status
        const isShowBomQuestions = this.isActiveBomAlert;
        // Store last sent notification date
        const surveyPushNotificationLastSentDate =
          this.surveyPushNotificationLastSentDate;

        // Reset store (including count)
        this.$reset();

        // Set the number of alerts in last time period
        this.alertsInLastTimePeriod = alertsInLastTimePeriod;
        // Set whether to show bom questions
        this.isShowBomQuestions = isShowBomQuestions;
        // Restore last sent notification date
        this.surveyPushNotificationLastSentDate =
          surveyPushNotificationLastSentDate;

        const dataPhoneNumberStore = useDataPhoneNumberStore();
        const dataUserStore = useDataUserStore();

        if (
          dataUserStore.isPhoneAppGroup &&
          (!this.surveyPushNotificationLastSentDate ||
            Date.now() - this.surveyPushNotificationLastSentDate.getTime() >
              ONE_HOUR)
        ) {
          // Send push notification for survey (phone app group)
          // This will also set the displayUserSurvey endpoint to true for that user
          if (this.alertsInLastTimePeriod > 0 && this.isShowBomQuestions) {
            dataPhoneNumberStore.sendSurveyNotification('both');
            this.surveyPushNotificationLastSentDate = new Date();
          } else if (this.alertsInLastTimePeriod > 0) {
            dataPhoneNumberStore.sendSurveyNotification('alert');
            this.surveyPushNotificationLastSentDate = new Date();
          } else if (this.isShowBomQuestions) {
            dataPhoneNumberStore.sendSurveyNotification('bom');
            this.surveyPushNotificationLastSentDate = new Date();
          } else {
            console.error('Not sending survey, something has gone wrong');
          }
        } else {
          // Show modal (base station group)
          this.isShowSurveyModal = true;
        }
      }
    },
    setup() {
      this.checkAndDisplaySurvey();
      // Check every 5 minutes for surveys
      setInterval(this.checkAndDisplaySurvey, 5 * 60 * 1000);
    },
  },
});
