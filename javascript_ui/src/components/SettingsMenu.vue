<template>
  <div class="full-height">
    <q-splitter v-model="splitterModel" style="height: calc(100vh - 60px)">
      <template v-slot:before>
        <q-tabs v-model="tab" vertical class="text-teal">
          <q-tab name="user-data" icon="person" label="User Data" />
          <q-tab name="sensors" icon="thermostat" label="Sensors" />
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels
          class="full-height q-mr-sm"
          v-model="tab"
          animated
          swipeable
          vertical
          transition-prev="slide-down"
          transition-next="slide-up"
        >
          <q-tab-panel name="user-data">
            <div class="text-h4 q-mb-md">User Data</div>
          </q-tab-panel>

          <q-tab-panel name="sensors">
            <div class="text-h4 q-mb-md">Sensors</div>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';

export default {
  setup() {
    return {
      tab: ref('user-data'),
      splitterModel: ref(20),
    };
  },
};
</script>
