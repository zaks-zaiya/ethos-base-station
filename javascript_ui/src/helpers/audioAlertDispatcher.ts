import { RiskLevel } from 'src/typings/data-types';
import { useVolumeStore } from 'src/stores/volume';

let currentAudio: HTMLAudioElement | null = null;

const playAudioTone = (riskLevel: RiskLevel): Promise<void> => {
  const volumeStore = useVolumeStore();
  return new Promise((resolve, reject) => {
    try {
      let audio = new Audio('medium-priority-alert.mp3');
      if (riskLevel === RiskLevel.HIGH) {
        audio = new Audio('high-priority-alert.mp3');
      }
      audio.volume = volumeStore.volumePercent;
      audio.onended = () => {
        currentAudio = null;
        resolve();
      };
      currentAudio = audio;
      audio.play().catch((error) => {
        currentAudio = null;
        console.error('Error playing audio:', error);
        reject(error);
      });
    } catch (error) {
      currentAudio = null;
      console.error(error);
      reject(error);
    }
  });
};

export const stopAudio = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.dispatchEvent(new Event('ended'));
  }
};

export const playAudio = async (riskLevel: RiskLevel): Promise<void> => {
  stopAudio(); // Stop any currently playing audio before starting new one
  return await playAudioTone(riskLevel);
};
