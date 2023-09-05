<template>
  <div class="text-h6 q-mb-md">User Data</div>
  <!-- Inputs below -->
  <q-input
    v-model="userId"
    label="User ID (check that it matches sticker)"
    class="q-pb-lg"
    filled
    disable
  />

  <input-keyboard
    v-model.number="dataUserStore.postcode"
    :customRule="dataUserStore.checkPostcode"
    :hint="`Lat: ${dataUserStore.latitude}, Lon: ${dataUserStore.longitude}`"
    type="number"
    label="Postcode"
  />

  <input-keyboard
    v-model.number="dataUserStore.ageYears"
    :customRule="dataUserStore.checkAge"
    type="number"
    label="Age (years)"
  />

  <input-keyboard
    v-model.number="dataUserStore.heightCm"
    :customRule="dataUserStore.checkHeight"
    type="number"
    label="Height (cm)"
  />

  <input-keyboard
    v-model.number="dataUserStore.weightKg"
    :customRule="dataUserStore.checkWeight"
    type="number"
    label="Weight (kg)"
  />

  <div class="q-mt-lg text-bold">What is your birth sex?</div>
  <q-option-group
    :options="sexOptions"
    type="radio"
    v-model="dataUserStore.sex"
  />
</template>

<script lang="ts">
import { useDataUserStore } from 'src/stores/dataUser';
import { computed, defineComponent } from 'vue';
import InputKeyboard from './InputKeyboard.vue';

export default defineComponent({
  components: {
    InputKeyboard,
  },
  setup() {
    const dataUserStore = useDataUserStore();
    const userId = computed(() => process.env.USER_ID);

    const sexOptions = [
      { label: 'Female', value: 'female' },
      { label: 'Male', value: 'male' },
      { label: 'Intersex/Prefer not to say', value: 'other' },
    ];

    return {
      dataUserStore,
      userId,
      sexOptions,
    };
  },
});
</script>
