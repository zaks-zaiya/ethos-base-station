<template>
  <InputPasscode />
</template>

<script lang="ts">
import InputPasscode from 'src/components/InputPasscode.vue';

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'IndexPage',
  components: { InputPasscode },
});
</script>

<style lang="scss" scoped></style>
