<template>
  <div>
    <div class="text-h6 q-mb-md">User Data</div>
    <!-- Inputs below -->
    <input-keyboard
      v-model.number="userDataStore.id"
      :customRule="checkId"
      type="number"
      label="User ID (number)"
    />

    <input-keyboard
      v-model.number="userDataStore.postcode"
      :customRule="checkPostcode"
      :hint="`Lat: ${userDataStore.latitude}, Lon: ${userDataStore.longitude}`"
      type="number"
      label="Postcode"
    />

    <input-keyboard
      v-model.number="userDataStore.ageYears"
      :customRule="checkAge"
      type="number"
      label="Age (years)"
    />
    <input-keyboard
      v-model.number="userDataStore.heightCm"
      :customRule="checkHeight"
      type="number"
      label="Height (cm)"
    />
    <input-keyboard
      v-model.number="userDataStore.weightKg"
      :customRule="checkWeight"
      type="number"
      label="Weight (kg)"
    />
  </div>
</template>

<script lang="ts">
import { useUserDataStore } from 'src/stores/userData';
import { defineComponent } from 'vue';

import postcodeArrayString from '../assets/australian_postcodes.js';
import InputKeyboard from './InputKeyboard.vue';

export default defineComponent({
  components: {
    InputKeyboard,
  },
  setup() {
    const userDataStore = useUserDataStore();

    const checkPostcode = (postcode: number): boolean | string => {
      // Queensland postcodes range from 4000-5000
      if (postcode < 4000 || postcode >= 5000) {
        return 'Please enter a QLD postcode (4000-4999)';
      }
      // ❗ The below function causes side effects and sets the latitude/longitude
      const foundLatLon = findAndSetPostcodeLatLon(postcode);
      if (!foundLatLon) {
        return 'Postcode lat/lon not found';
      }
      // Everything looks ok
      return true;
    };

    /**
     * Lookup and set the latitude and longitude for a certain postcode
     * ❗ Side effect: will also change the lat/lon in the userDataStore
     * @returns true if lat/lon are found, otherwise false
     */
    const findAndSetPostcodeLatLon = (postcode: number): boolean => {
      // Lookup postcode latitude and longitude
      const postcodeArray = JSON.parse(postcodeArrayString);
      let postcodeString = postcode.toString();
      // Loop through all postcodes and find correct one
      for (let area of postcodeArray) {
        // Postcode found
        if (area.postcode === postcodeString) {
          // Set postcode, latitude and longitude
          userDataStore.latitude = area.lat;
          userDataStore.longitude = area.long;
          return true;
        }
      }
      // No postcode found
      return false;
    };

    const checkId = (id: number) => {
      if (id && id > 0) {
        userDataStore.id = id;
        return true;
      }
      return 'Please enter an ID';
    };

    const checkAge = (age: number) => {
      if (age > 0 && age < 200) {
        userDataStore.ageYears = age;
        return true;
      }
      return 'Invalid age value';
    };

    const checkHeight = (height: number) => {
      if (height > 30 && height < 300) {
        userDataStore.heightCm = height;
        return true;
      }
      return 'Invalid height value';
    };

    const checkWeight = (weight: number) => {
      if (weight > 10 && weight < 300) {
        userDataStore.weightKg = weight;
        return true;
      }
      return 'Invalid weight value';
    };

    return {
      userDataStore,
      checkPostcode,
      checkId,
      checkAge,
      checkHeight,
      checkWeight,
    };
  },
});
</script>
