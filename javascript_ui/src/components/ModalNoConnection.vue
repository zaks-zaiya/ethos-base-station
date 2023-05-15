<template>
  <q-dialog v-model="isDisconnected" :persistent="true">
    <q-card class="bg-negative text-white text-h6">
      <q-card-section>
        <div>
          Error, unable to connect to temperature sensors (socket issue). This
          indicates that the app has crashed and will need to be relaunched.
        </div>
        <ContactCard />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

import { useDataSensorStore } from 'stores/dataSensor';
import ContactCard from './ContactCard.vue';

export default defineComponent({
  name: 'ModalNoConnection',
  components: { ContactCard },
  setup() {
    const store = useDataSensorStore();
    return {
      isDisconnected: computed(() => !store.isConnected),
    };
  },
});
</script>
