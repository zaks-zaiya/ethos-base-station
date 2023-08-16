import { defineStore } from 'pinia';

export const useSurveyStore = defineStore('survey', {
  persist: true,
  state: () => ({
    alertsSinceLastSurvey: 0,
    isShowSurveyModal: false,
  }),
  actions: {
    incrementAlertCount() {
      this.alertsSinceLastSurvey++;
    },
    setup() {
      const checkAndDisplaySurvey = () => {
        const currentHour = new Date().getHours();
        if (currentHour === 19 && this.alertsSinceLastSurvey > 0) {
          // Reset alerts count
          this.alertsSinceLastSurvey = 0;
          // Show modal
          this.isShowSurveyModal = true;
        }
      };

      // Check every 5 minutes for surveys
      setInterval(checkAndDisplaySurvey, 5 * 60 * 1000);
    },
  },
});
