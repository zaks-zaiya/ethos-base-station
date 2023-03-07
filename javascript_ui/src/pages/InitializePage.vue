<template>
  <div class="q-px-md q-pb">
    <q-stepper v-model="step" ref="stepper" color="primary" animated header-nav>
      <q-step :name="1" title="Setup Wizard" icon="settings" :done="step > 1">
        Looks like there may be some undefined data. This page will walk you
        through setting everything up.
        <div class="q-my-sm">
          If you do not intend to be here please contact the Ethos team:
        </div>
        <ContactCard />
      </q-step>

      <q-step
        :name="2"
        title="Setup User Data"
        icon="create_new_folder"
        :done="step > 2"
      >
        <SettingsMenuUserData />
      </q-step>

      <q-step
        :name="3"
        title="Setup Sensor Data"
        icon="assignment"
        :done="step > 3"
        :header-nav="step >= 2 && isNextStepAvailable"
      >
        <SettingsMenuSensors />
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn
            @click="nextStep"
            color="primary"
            :disable="!isNextStepAvailable"
            :label="step === 3 ? 'Finish' : 'Continue'"
          />
          <q-btn
            v-if="step > 1"
            flat
            color="primary"
            @click="() => $refs.stepper.previous()"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import ContactCard from 'src/components/ContactCard.vue';
import SettingsMenuUserData from 'src/components/SettingsMenuUserData.vue';
import SettingsMenuSensors from 'src/components/SettingsMenuSensors.vue';
import { useUserDataStore } from 'src/stores/userData';
import { useSensorDataStore } from 'src/stores/sensorData';

export default {
  setup() {
    const step = ref(1);
    const stepper = ref(null);

    const router = useRouter();
    const userDataStore = useUserDataStore();
    const sensorDataStore = useSensorDataStore();

    const isNextStepAvailable = computed(() => {
      // Info Page
      if (step.value === 1) {
        return true;
      }
      // User Data
      else if (step.value === 2 && !userDataStore.containsUndefined) {
        return true;
      }
      // Sensor Data
      else if (step.value === 3 && !sensorDataStore.containsUndefined) {
        return true;
      }
      return false;
    });

    const nextStep = () => {
      if (step.value === 3) {
        // Finish and move back to home
        router.push('/');
      } else {
        // Move to next step of setup
        stepper.value.next();
      }
    };
    return {
      step,
      stepper,
      isNextStepAvailable,
      nextStep,
    };
  },
  components: { ContactCard, SettingsMenuUserData, SettingsMenuSensors },
};
</script>
