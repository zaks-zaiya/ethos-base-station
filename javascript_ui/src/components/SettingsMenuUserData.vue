<template>
  <div>
    <div class="text-h6 q-mb-md">User Data</div>
    <q-input
      outlined
      v-model.number="userDataStore.postcode"
      :rules="[checkQldPostcode, findPostcode]"
      :hint="`Lat: ${userDataStore.latitude}, Lon: ${userDataStore.longitude}`"
      type="number"
      label="Postcode"
      class="q-my-md"
    />

    <q-input
      outlined
      v-model.number="userDataStore.ageYears"
      type="number"
      label="Age (years)"
      class="q-my-md"
    />
    <q-input
      outlined
      v-model.number="userDataStore.heightCm"
      type="number"
      label="Height (cm)"
      class="q-my-md"
    />
    <q-input
      outlined
      v-model.number="userDataStore.weightKg"
      type="number"
      label="Weight (kg)"
      class="q-my-md"
    />
  </div>
</template>

<script lang="ts">
import { useUserDataStore } from 'src/stores/userData';
import { defineComponent } from 'vue';

import postcodeArrayString from '../assets/australian_postcodes.js';

export default defineComponent({
  setup() {
    let userDataStore = useUserDataStore();

    let checkQldPostcode = (postcode: number) => {
      // QLD postcode should be from 4000-4999
      if (postcode >= 4000 && postcode < 5000) {
        return true;
      }
      return 'Please enter a QLD postcode (4000-4999)';
    };

    let findPostcode = (postcode: number) => {
      const postcodeArray = JSON.parse(postcodeArrayString);
      let postcodeString = postcode.toString();
      // Loop through all postcodes and find correct one
      for (let area of postcodeArray) {
        if (area.postcode === postcodeString) {
          // Set latitude and longitude
          userDataStore.latitude = area.lat;
          userDataStore.longitude = area.long;
          return true;
        }
      }
      // No postcode found
      userDataStore.latitude = undefined;
      userDataStore.longitude = undefined;
      return 'Postcode not found';
    };

    return { userDataStore, checkQldPostcode, findPostcode };
  },
});
</script>
