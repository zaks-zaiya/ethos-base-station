<!-- ModalNoConnection.vue -->
<template>
  <q-dialog v-model="showModal" full-width persistent> </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'ModalHeatAlert',
  components: {},
  setup() {
    let showModal = ref(false);
    return {
      showModal,
    };
  },
});
</script>

<style lang="scss" scoped></style>
