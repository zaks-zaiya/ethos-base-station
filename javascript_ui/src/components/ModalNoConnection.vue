<template>
  <q-dialog v-model="isDisconnected" :persistent="true">
    <q-card class="bg-negative text-white text-h6">
      <q-card-section>
        <div>
          Error, unable to connect to temperature sensors (socket issue). This
          indicates that the app has crashed and will need to be relaunched.
        </div>
        <CardContact />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

import CardContact from './CardContact.vue';
import { useSocketStore } from 'src/stores/socket';

export default defineComponent({
  name: 'ModalNoConnection',
  components: { CardContact },
  setup() {
    const socketStore = useSocketStore();
    return {
      isDisconnected: computed(() => !socketStore.isConnected),
    };
  },
});
</script>
