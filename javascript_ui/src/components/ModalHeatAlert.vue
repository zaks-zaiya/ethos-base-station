<!-- ModalHeatAlert.vue -->
<template>
  <q-dialog v-model="showModal" full-width persistent>
    <q-card :class="flashClass">
      <q-card-section v-if="alertSensor">
        <div class="fontsize-30 text-bold">Heat Alert</div>
        <div class="fontsize-20">
          The <b>{{ alertSensor.name }}</b> has recorded temperature readings
          which indicate that your body may be beginning to overheat if you are
          located in that area.
        </div>
        <div class="fontsize-20 text-bold q-mt-md">
          Your risk level is estimated to be: {{ riskLevelText }}
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-mb-lg">
        <q-btn
          :label="`I am not located at ${alertSensor?.name}`"
          class="fontsize-15 q-mr-lg"
          color="warning"
          @click="notLocatedAt"
        />
        <q-btn
          label="Help me cool down"
          class="fontsize-15 q-mr-lg"
          color="primary"
          @click="coolDown"
        />
        <q-btn
          label="Dismiss"
          class="fontsize-15 q-mr-lg"
          color="negative"
          @click="dismiss"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useDataSensorStore } from 'stores/dataSensor';
import { RiskLevel } from './models';

export default defineComponent({
  name: 'ModalHeatAlert',
  components: {},
  setup(props, { emit }) {
    const store = useDataSensorStore();

    const alertSensor = computed(() => store.alertSensor);
    const showModal = computed(() => store.alertSensor !== null);

    const flashClass = computed(() => {
      switch (store.alertSensor?.riskLevel) {
        case RiskLevel.MEDIUM:
          return 'flash-yellow';
        case RiskLevel.HIGH:
          return 'flash-red';
        default:
          return '';
      }
    });

    const riskLevelText = computed(() => {
      switch (store.alertSensor?.riskLevel) {
        case RiskLevel.LOW:
          return 'LOW';
        case RiskLevel.MEDIUM:
          return 'MEDIUM';
        case RiskLevel.HIGH:
          return 'HIGH';
        default:
          return 'unknown';
      }
    });

    const notLocatedAt = () => {
      // TODO: Record action
      store.alertSensor = null;
      console.log('Not located at ' + alertSensor.value?.name);
    };

    const coolDown = () => {
      // TODO: Record action
      store.alertSensor = null;
      emit('open-cooling-modal');
      console.log('Cooling down...');
    };

    const dismiss = () => {
      // TODO: Record action
      // Dismiss the alert
      store.alertSensor = null;
    };

    return {
      alertSensor,
      showModal,
      riskLevelText,
      flashClass,
      notLocatedAt,
      coolDown,
      dismiss,
    };
  },
});
</script>

<style lang="scss" scoped>
.flash-yellow {
  animation: flash-yellow 3s infinite;
}

@keyframes flash-yellow {
  0%,
  50%,
  100% {
    background-color: white;
  }
  25%,
  75% {
    background-color: #ffe291;
  }
}

.flash-red {
  animation: flash-red 3s infinite;
}

@keyframes flash-red {
  0%,
  50%,
  100% {
    background-color: white;
  }
  25%,
  75% {
    background-color: #b35959;
  }
}

@keyframes flash {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.1;
  }
  100% {
    opacity: 1;
  }
}
</style>
