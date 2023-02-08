<template>
  <div>
    <InputPasscode v-if="!isShowSettings" @success="isShowSettings = true" />
    <SettingsMenu v-if="isShowSettings" />
  </div>
</template>

<script lang="ts">
import InputPasscode from 'src/components/InputPasscode.vue';
import SettingsMenu from 'src/components/SettingsMenu.vue';

import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'IndexPage',
  components: { InputPasscode, SettingsMenu },
  setup() {
    let isShowSettings = ref(false);

    return { isShowSettings };
  },
});
</script>

<style lang="scss" scoped></style>
