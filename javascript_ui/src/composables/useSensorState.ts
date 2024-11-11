import { computed } from 'vue';
import { SensorData } from 'src/typings/data-types';
import { isOfflineSensor } from 'src/helpers/dataSensor';
import { useDateTimeStore } from 'src/stores/dateTime';

export function useSensorState(sensor: SensorData) {
  const dateTimeStore = useDateTimeStore();

  const isOffline = computed(() => {
    return isOfflineSensor(sensor, dateTimeStore.currentDate.getTime());
  });

  const signalStrengthIcon = computed(() => {
    if (!sensor.rssi) {
      return 'signal_cellular_0_bar';
    } else if (sensor.rssi > -80) {
      return 'signal_cellular_alt';
    } else if (sensor.rssi > -95) {
      return 'signal_cellular_alt_2_bar';
    } else {
      return 'signal_cellular_alt_1_bar';
    }
  });

  const formattedLastSeen = computed(() => {
    if (!sensor.lastSeen) return 'Never';

    const strTime = sensor.lastSeen.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return strTime + ', ' + sensor.lastSeen.toLocaleDateString();
  });

  return {
    isOffline,
    signalStrengthIcon,
    formattedLastSeen,
  };
}
