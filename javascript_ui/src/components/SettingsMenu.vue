<template>
  <div>
    <q-splitter v-model="splitterModel" :class="heightClass">
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
  </div>
</template>

<script lang="ts">
import { useKeyboardStore } from 'src/stores/keyboard';
import { defineComponent, ref, computed } from 'vue';
import SettingsMenuReset from './SettingsMenuReset.vue';
import SettingsMenuSensors from './SettingsMenuSensors.vue';
import SettingsMenuUserData from './SettingsMenuUserData.vue';

export default defineComponent({
  components: { SettingsMenuUserData, SettingsMenuSensors, SettingsMenuReset },
  setup() {
    const keyboardStore = useKeyboardStore();
    const heightClass = computed(() => {
      if (keyboardStore.isKeyboardBound) {
        return 'height-keyboard-open';
      }
      return 'height-keyboard-closed';
    });
    return {
      heightClass,
      tab: ref('user-data'),
      splitterModel: ref(20),
    };
  },
});
</script>

<style lang="scss" scoped>
.height-keyboard-open {
  height: calc(100vh - 240px);
  transition: height 0.15s ease-out;
}
.height-keyboard-closed {
  height: calc(100vh - 60px);
  transition: height 0.15s ease-in;
}
</style>
