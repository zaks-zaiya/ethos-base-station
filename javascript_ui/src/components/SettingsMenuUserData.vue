<template>
  <div>
    <div class="text-h6 q-mb-md">User Data</div>
    <q-input outlined v-model="name" label="Postcode" class="q-my-md" />
    <q-input outlined v-model="name" label="Age (years)" class="q-my-md" />
    <q-input outlined v-model="name" label="Height (cm)" class="q-my-md" />
    <q-input outlined v-model="name" label="Weight (kg)" class="q-my-md" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    let name = '';
    return { name };
  },
});
</script>
