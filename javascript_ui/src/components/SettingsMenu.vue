<template>
  <div>
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
          vertical
          transition-prev="slide-down"
          transition-next="slide-up"
        >
          <q-tab-panel name="user-data">
            <div class="text-h4 q-mb-md">User Data</div>
            <SettingsMenuUserData />
          </q-tab-panel>

          <q-tab-panel name="sensors">
            <SettingsMenuSensors />
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import SettingsMenuSensors from './SettingsMenuSensors.vue';
import SettingsMenuUserData from './SettingsMenuUserData.vue';

export default defineComponent({
  components: { SettingsMenuUserData, SettingsMenuSensors },
  setup() {
    return {
      tab: ref('user-data'),
      splitterModel: ref(20),
    };
  },
});
</script>
