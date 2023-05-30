import { AudioType, RiskLevel, SensorData } from 'src/components/models';

const playAudioTone = (riskLevel: RiskLevel) => {
  let audio = new Audio('/medium-priority-alert.mp3');
  if (riskLevel === RiskLevel.HIGH) {
    audio = new Audio('/high-priority-alert.mp3');
  }
  audio.play();
};

const generateTextToSpeech = (
  riskLevel: RiskLevel,
  sensorData?: SensorData
) => {
  switch (riskLevel) {
    case RiskLevel.LOW:
      return 'There is a low priority alert';
    case RiskLevel.MEDIUM:
      return sensorData
        ? `The ${sensorData.name} is at an elevated temperature`
        : 'There is a medium priority alert';
    case RiskLevel.HIGH:
      return sensorData
        ? `The ${sensorData.name} is at a dangerous temperature`
        : 'There is a high priority alert';
  }
};

export const playTextToSpeech = (text: string) => {
  const utter = new SpeechSynthesisUtterance();
  utter.text = text;
  utter.rate = 0.9;
  utter.onend = function () {
    return;
  };
  speechSynthesis.speak(utter);
};

export const playAudio = (
  audioType: AudioType,
  riskLevel: RiskLevel,
  sensorData?: SensorData
) => {
  switch (audioType) {
    case AudioType.TONE:
      playAudioTone(riskLevel);
      break;
    case AudioType.TTS:
      const alertText = generateTextToSpeech(riskLevel, sensorData);
      playTextToSpeech(alertText);
      break;
    default:
      console.error('Unable to find correct audio type');
  }
};
