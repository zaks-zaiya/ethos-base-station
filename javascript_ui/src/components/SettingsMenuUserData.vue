<template>
  <div>
    <div class="text-h6 q-mb-md">User Data</div>
    <q-input
      outlined
      v-model.number="newId"
      :rules="[checkAndSetId]"
      type="number"
      label="User ID (number)"
      class="q-my-md"
    />

    <q-input
      outlined
      v-model.number="newPostcode"
      :rules="[checkQldPostcode, findAndSetPostcode]"
      :hint="`Lat: ${userDataStore.latitude}, Lon: ${userDataStore.longitude}`"
      type="number"
      label="Postcode"
      class="q-my-md"
    />

    <q-input
      outlined
      v-model.number="newAge"
      :rules="[checkAndSetAge]"
      type="number"
      label="Age (years)"
      class="q-my-md"
    />
    <q-input
      outlined
      v-model.number="newHeight"
      :rules="[checkAndSetHeight]"
      type="number"
      label="Height (cm)"
      class="q-my-md"
    />
    <q-input
      outlined
      v-model.number="newWeight"
      :rules="[checkAndSetWeight]"
      type="number"
      label="Weight (kg)"
      class="q-my-md"
    />
  </div>
</template>

<script lang="ts">
import { useUserDataStore } from 'src/stores/userData';
import { defineComponent, ref } from 'vue';

import postcodeArrayString from '../assets/australian_postcodes.js';

export default defineComponent({
  setup() {
    const userDataStore = useUserDataStore();

    const newPostcode = ref(userDataStore.postcode);
    const newId = ref(userDataStore.id);
    const newAge = ref(userDataStore.ageYears);
    const newHeight = ref(userDataStore.heightCm);
    const newWeight = ref(userDataStore.weightKg);

    const checkQldPostcode = (postcode: number) => {
      // QLD postcode should be from 4000-4999
      if (postcode >= 4000 && postcode < 5000) {
        return true;
      }
      return 'Please enter a QLD postcode (4000-4999)';
    };

    const findAndSetPostcode = (postcode: number) => {
      const postcodeArray = JSON.parse(postcodeArrayString);
      let postcodeString = postcode.toString();
      // Loop through all postcodes and find correct one
      for (let area of postcodeArray) {
        // Postcode found
        if (area.postcode === postcodeString) {
          // Set postcode, latitude and longitude
          userDataStore.postcode = postcode;
          userDataStore.latitude = area.lat;
          userDataStore.longitude = area.long;
          return true;
        }
      }
      // No postcode found
      return 'Postcode not found';
    };

    const checkAndSetId = (id: number) => {
      if (id && id > 0) {
        userDataStore.id = id;
        return true;
      }
      return 'Please enter an ID';
    };

    const checkAndSetAge = (age: number) => {
      if (age > 0 && age < 200) {
        userDataStore.ageYears = age;
        return true;
      }
      return 'Invalid age value';
    };

    const checkAndSetHeight = (height: number) => {
      if (height > 30 && height < 300) {
        userDataStore.heightCm = height;
        return true;
      }
      return 'Invalid height value';
    };

    const checkAndSetWeight = (weight: number) => {
      if (weight > 10 && weight < 300) {
        userDataStore.weightKg = weight;
        return true;
      }
      return 'Invalid weight value';
    };

    return {
      userDataStore,
      newId,
      newPostcode,
      newAge,
      newHeight,
      newWeight,
      checkQldPostcode,
      findAndSetPostcode,
      checkAndSetId,
      checkAndSetAge,
      checkAndSetHeight,
      checkAndSetWeight,
    };
  },
});
</script>
