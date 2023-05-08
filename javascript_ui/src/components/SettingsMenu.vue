<template>
  <div>
    <KeyboardAutoScroll>
      <q-splitter v-model="splitterModel">
        <template v-slot:before>
          <q-tabs v-model="tab" vertical class="text-teal">
            <q-tab name="user-data" icon="person" label="User Data" />
            <q-tab name="sensors" icon="thermostat" label="Sensors" />
            <q-tab name="reset" icon="warning" label="Reset App" />
            <q-tab name="quit" icon="power_settings_new" label="Quit" />
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
            <q-tab-panel name="user-data" class="remaining-height">
              <SettingsMenuUserData />
            </q-tab-panel>

            <q-tab-panel name="sensors" class="remaining-height">
              <SettingsMenuSensors />
            </q-tab-panel>

            <q-tab-panel name="reset" class="remaining-height">
              <SettingsMenuReset />
            </q-tab-panel>

            <q-tab-panel name="quit" class="remaining-height">
              <SettingsMenuQuit />
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
import SettingsMenuQuit from './SettingsMenuQuit.vue';
import KeyboardAutoScroll from 'src/components/KeyboardAutoScroll.vue';

export default defineComponent({
  components: {
    SettingsMenuUserData,
    SettingsMenuSensors,
    SettingsMenuReset,
    SettingsMenuQuit,
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

<style lang="scss" scoped>
.settings-tab-panel {
  height: $remaining-height;
}
</style>
