<template>
  <div>
    <div class="text-h6 q-mb-md">User Data</div>
    <q-input
      outlined
      v-model.number="userDataStore.$state.postcode"
      type="number"
      label="Postcode"
      class="q-my-md"
    />
    <q-input
      outlined
      v-model.number="userDataStore.$state.ageYears"
      type="number"
      label="Age (years)"
      class="q-my-md"
    />
    <q-input
      outlined
      v-model.number="userDataStore.$state.heightCm"
      type="number"
      label="Height (cm)"
      class="q-my-md"
    />
    <q-input
      outlined
      v-model.number="userDataStore.$state.weightKg"
      type="number"
      label="Weight (kg)"
      class="q-my-md"
    />
  </div>
</template>

<script lang="ts">
import { useUserDataStore } from 'src/stores/userData';
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    let userDataStore = useUserDataStore();
    return { userDataStore };
  },
});
</script>
