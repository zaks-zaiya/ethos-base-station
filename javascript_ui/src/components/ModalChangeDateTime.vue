<template>
  <q-dialog v-model="showModal">
    <q-card style="width: 800px; max-width: 90vw">
      <q-card-section class="row items-center">
        <div class="text-bold q-mr-xl">Adjust Datetime</div>
        <q-space />
        <q-btn icon="close" color="primary" v-close-popup>Close</q-btn>
      </q-card-section>
      <q-card-section class="row q-pa-lg">
        <div class="q-pa-md">
          <div class="text">Current Datetime: {{ selectedDateTime }}</div>

          <div class="q-gutter-md row items-start">
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
        <q-btn color="primary" @click="setSystemTime">Set Time</q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed, ref, onMounted } from 'vue';

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

    const setSystemTime = () => {
      window.myElectronAPI?.send('set-system-time', selectedDateTime.value);
    };

    onMounted(() => {
      window.myElectronAPI?.on(
        'set-system-time-response',
        (event, response) => {
          console.log(response); // handle the response here, maybe update component data or show a notification
        }
      );
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
