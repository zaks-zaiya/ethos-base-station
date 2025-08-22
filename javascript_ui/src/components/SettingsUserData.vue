<template>
  <div class="text-h6 q-mb-md">User Data</div>
  <!-- Carer group or App group -->
  <div class="q-mt-lg text-bold">
    Is this user part of the Phone App group or Carer group?
  </div>
  <q-option-group
    :options="researchGroupOptions"
    size="lg"
    class="q-mb-lg text"
    type="radio"
    v-model="dataUserStore.isPhoneAppGroup"
  />

  <!-- Is a Fitbit user? -->
  <template v-if="dataUserStore.isPhoneAppGroup">
    <div class="q-mt-lg text-bold">
      Will this user be receiving a Fitbit to use during the trial?
    </div>
    <q-toggle
      size="lg"
      class="q-mb-lg text"
      :label="dataUserStore.isFitbitUser ? 'Yes' : 'No'"
      v-model="dataUserStore.isFitbitUser"
    />
  </template>

  <div class="q-mt-lg text-bold">Database information</div>
  <!-- User ID -->
  <input-keyboard
    v-model.number="dataUserStore.id"
    :customRule="dataUserStore.checkId"
    type="number"
    label="User ID"
  />

  <!-- User DB password -->
  <input-keyboard
    v-model="dataUserStore.password"
    :customRule="dataUserStore.checkPassword"
    type="text"
    label="User Password"
  />

  <!-- Database connection status -->
  <div class="text q-mb-lg">
    Database connection status:
    <template v-if="databaseStore.replicationStatus === 'initial'">
      <q-spinner color="primary" size="lg" :thickness="10" />
    </template>
    <template
      v-else-if="
        databaseStore.replicationErrorMessage &&
        databaseStore.replicationErrorMessage.length > 0
      "
    >
      <q-icon name="cancel" color="negative" size="lg" />
    </template>
    <template v-else>
      <q-icon name="check_circle" color="positive" size="lg" />
    </template>
    <!-- Refresh button -->
    <q-btn
      label="refresh"
      class="q-ml-md"
      @click="databaseStore.initializeDatabase()"
      color="primary"
    />
    <!-- Error message -->
    <div
      class="text-bold"
      v-if="
        databaseStore.replicationErrorMessage &&
        databaseStore.replicationErrorMessage.length > 0
      "
    >
      Error: {{ databaseStore.replicationErrorMessage }}
    </div>
  </div>

  <div class="q-mt-lg text-bold">User information</div>
  <!-- Postcode -->
  <input-keyboard
    v-model.number="dataUserStore.postcode"
    :customRule="dataUserStore.checkPostcode"
    :hint="`Lat: ${dataUserStore.latitude}, Lon: ${dataUserStore.longitude}`"
    type="number"
    label="Postcode"
  />

  <!-- Age -->
  <input-keyboard
    v-model.number="dataUserStore.ageYears"
    :customRule="dataUserStore.checkAge"
    type="number"
    label="Age (years)"
  />

  <!-- Height -->
  <input-keyboard
    v-model.number="dataUserStore.heightCm"
    :customRule="dataUserStore.checkHeight"
    type="number"
    label="Height (cm)"
  />

  <!-- Weight -->
  <input-keyboard
    v-model.number="dataUserStore.weightKg"
    :customRule="dataUserStore.checkWeight"
    type="number"
    label="Weight (kg)"
  />

  <!-- Address -->
  <input-keyboard
    v-model="dataUserStore.address"
    :customRule="dataUserStore.checkAddress"
    label="Address"
  />

  <!-- Sex -->
  <div class="q-mt-lg text-bold">What is your birth sex?</div>
  <q-option-group
    :options="sexOptions"
    size="lg"
    class="text"
    type="radio"
    v-model="dataUserStore.sex"
  />

  <!-- SMS Notifications -->
  <div class="q-mt-lg text-bold">Do you want to enable SMS notifications?</div>
  <div class="q-mt-lg">
    <q-toggle
      v-model="dataPhoneNumberStore.isSmsNotificationsEnabled"
      label="Enable SMS Notifications"
    />
  </div>

  <!-- Phone Numbers -->
  <input-phone-numbers
    v-if="dataPhoneNumberStore.isSmsNotificationsEnabled"
    v-model="dataPhoneNumberStore.phoneNumbers"
    :checkPhoneNumber="dataPhoneNumberStore.checkPhoneNumber"
    :parsePhoneNumber="dataPhoneNumberStore.getParsedPhoneNumbers"
  />
</template>

<script lang="ts">
import { useDataUserStore } from 'src/stores/dataUser';
import { useDataPhoneNumberStore } from 'src/stores/dataPhoneNumberStore';
import { useDatabaseStore } from 'src/stores/database';
import { computed, defineComponent } from 'vue';
import InputKeyboard from './InputKeyboard.vue';
import InputPhoneNumbers from './InputPhoneNumbers.vue';

export default defineComponent({
  components: {
    InputKeyboard,
    InputPhoneNumbers,
  },
  setup() {
    const dataUserStore = useDataUserStore();
    const dataPhoneNumberStore = useDataPhoneNumberStore();
    const databaseStore = useDatabaseStore();

    const userId = computed(() => dataUserStore.id);

    const sexOptions = [
      { label: 'Female', value: 'female' },
      { label: 'Male', value: 'male' },
      { label: 'Intersex/Prefer not to say', value: 'other' },
    ];

    const researchGroupOptions = [
      {
        label: 'Phone app group (will install app on own phone)',
        value: true,
      },
      { label: 'Carer group (will use base station)', value: false },
    ];

    const addPhoneNumber = () => {
      dataPhoneNumberStore.phoneNumbers.push('');
    };

    const removePhoneNumber = (index: number) => {
      dataPhoneNumberStore.phoneNumbers.splice(index, 1);
    };

    return {
      dataUserStore,
      dataPhoneNumberStore,
      databaseStore,
      userId,
      sexOptions,
      researchGroupOptions,
      addPhoneNumber,
      removePhoneNumber,
    };
  },
});
</script>
