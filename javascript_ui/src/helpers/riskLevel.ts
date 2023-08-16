import { SensorData, RiskLevel } from 'src/components/models';
import { useDataUserStore } from 'src/stores/dataUser';
import { useSocketStore } from 'src/stores/socket';

// Return the risk level as 'high', 'medium', low' or '' (undefined)
const getRiskLevel = async (sensorData: SensorData) => {
  const socketStore = useSocketStore();
  const dataUserStore = useDataUserStore();

  // Check all required data is available
  if (
    !(
      dataUserStore.heightCm &&
      dataUserStore.weightKg &&
      dataUserStore.ageYears &&
      dataUserStore.sex &&
      sensorData.temperature &&
      sensorData.humidity
    )
  ) {
    console.error('Unable to calculate risk level, missing some data');
    return undefined;
  }

  // Calculate core temperature
  const coreTemperature = await socketStore.calculatePredictedCoreTemperature({
    heightM: dataUserStore.heightCm / 100,
    weightKg: dataUserStore.weightKg,
    ageYears: dataUserStore.ageYears,
    sex: dataUserStore.sex == 'female' ? 'female' : 'male',
    Ta: sensorData.temperature,
    RH: sensorData.humidity,
  });
  // Check undefined
  if (!coreTemperature) {
    console.error('Unable to calculate risk level, core temp not defined');
    return undefined;
  }
  if (coreTemperature >= 38) {
    return RiskLevel.HIGH;
  } else if (coreTemperature >= 37.7) {
    return RiskLevel.MEDIUM;
  } else if (coreTemperature < 37.7) {
    return RiskLevel.LOW;
  } else {
    console.error('Unable to calculate risk level (unknown error)');
    return undefined;
  }
};

export { getRiskLevel };
