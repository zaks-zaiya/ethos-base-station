<template>
  <q-dialog v-model="showModal" persistent>
    <q-card style="max-width: 90vw">
      <q-card-section class="row items-center">
        <div class="text-bold">Adjust Datetime</div>
        <q-space />
        <q-btn icon="close" color="primary" v-close-popup>Close</q-btn>
      </q-card-section>
      <q-card-section class="-pa-lg">
        <div class="q-pa-md">
          <div class="q-gutter-md row">
            <q-date
              v-model="selectedDateTime"
              mask="YYYY-MM-DD HH:mm"
              color="primary"
            />
            <q-time
              v-model="selectedDateTime"
              mask="YYYY-MM-DD HH:mm"
              color="primary"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <q-btn
          color="positive"
          class="float-right q-mb-md"
          @click="setSystemTime"
          >Set Time</q-btn
        >
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed, ref, onMounted, watch } from 'vue';

export default defineComponent({
  name: 'ModalVolume',
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { modelValue } = toRefs(props);
    const showModal = computed({
      get() {
        return modelValue.value;
      },
      set(newValue) {
        emit('update:modelValue', newValue);
      },
    });

    const formatDate = (date: Date) => {
      const yyyy = date.getFullYear().toString().padStart(4, '0');
      const MM = (date.getMonth() + 1).toString().padStart(2, '0');
      const dd = date.getDate().toString().padStart(2, '0');
      const hh = date.getHours().toString().padStart(2, '0');
      const mm = date.getMinutes().toString().padStart(2, '0');
      return `${yyyy}-${MM}-${dd} ${hh}:${mm}`;
    };

    const selectedDateTime = ref(formatDate(new Date()));

    // Update time when modal is shwon
    watch(showModal, (newVal) => {
      if (newVal) {
        selectedDateTime.value = formatDate(new Date());
      }
    });

    // Funtion to send command to set system time
    const setSystemTime = () => {
      console.log('Setting time...');
      window.myElectronAPI?.send('set-system-time', selectedDateTime.value);
    };

    onMounted(() => {
      window.myElectronAPI?.on('set-system-time-response', (response) => {
        if (response.success) {
          console.log(response.message);
          // TODO: Force refresh of time component
        } else {
          console.error(response.message);
        }
      });
    });

    return {
      showModal,
      selectedDateTime,
      setSystemTime,
    };
  },
});
</script>

<style scoped></style>
