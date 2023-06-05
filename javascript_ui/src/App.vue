<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { useDataSensorStore } from 'stores/dataSensor';
import { useForecastStore } from 'stores/forecast';

export default defineComponent({
  name: 'App',
  // Setup store connections here
  setup() {
    const dataSensorStore = useDataSensorStore();
    dataSensorStore.setup();

    const forecastStore = useForecastStore();
    forecastStore.setup();

    // Add touch/click feedback to app
    document.addEventListener('click', function (event: MouseEvent) {
      const effect = document.createElement('div');
      effect.classList.add('click-effect');
      effect.style.top = `${event.clientY - 25}px`; // offset by half the height/width to center the effect
      effect.style.left = `${event.clientX - 25}px`;
      document.body.appendChild(effect);

      setTimeout(() => {
        document.body.removeChild(effect);
      }, 1000); // remove after 1 second
    });
  },
});
</script>

<style lang="scss">
/* Hide cursor in program for touch screen use */
* {
  cursor: none !important;
}

/* Extend all q-btn components with a larger font size */
.q-btn {
  @extend .fontsize-12;
}

/* Click effect for haptic feedback */
.click-effect {
  position: absolute;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  pointer-events: none;
  animation: click-effect 1s ease-out;
}

@keyframes click-effect {
  from {
    transform: scale(0);
    opacity: 0.5;
  }
  to {
    transform: scale(2);
    opacity: 0;
  }
}
</style>
