<template>
  <div>
    <KeyboardAutoScroll>
      <q-splitter v-model="splitterModel">
        <template v-slot:before>
          <q-tabs v-model="tab" vertical class="text-teal">
            <q-tab name="user-data" icon="person" label="User Data" />
            <q-tab name="sensors" icon="thermostat" label="Sensors" />
            <q-tab name="reset" icon="warning" label="Reset App" />
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
              <SettingsMenuUserData />
            </q-tab-panel>

            <q-tab-panel name="sensors">
              <SettingsMenuSensors />
            </q-tab-panel>

            <q-tab-panel name="reset">
              <SettingsMenuReset />
            </q-tab-panel>
          </q-tab-panels>
        </template>
      </q-splitter>
    </KeyboardAutoScroll>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import SettingsMenuReset from './SettingsMenuReset.vue';
import SettingsMenuSensors from './SettingsMenuSensors.vue';
import SettingsMenuUserData from './SettingsMenuUserData.vue';
import KeyboardAutoScroll from 'src/components/KeyboardAutoScroll.vue';

export default defineComponent({
  components: {
    SettingsMenuUserData,
    SettingsMenuSensors,
    SettingsMenuReset,
    KeyboardAutoScroll,
  },
  setup() {
    return {
      tab: ref('user-data'),
      splitterModel: ref(20),
    };
  },
});
</script>
