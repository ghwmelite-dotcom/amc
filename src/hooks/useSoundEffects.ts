import { useCallback, useRef } from 'react';

type SoundType = 'click' | 'hover' | 'success' | 'alert' | 'whoosh' | 'notification';

interface SoundConfig {
  freq: number;
  duration: number;
  type: OscillatorType;
  volume?: number;
}

const soundConfigs: Record<SoundType, SoundConfig> = {
  click: { freq: 800, duration: 0.08, type: 'sine', volume: 0.08 },
  hover: { freq: 600, duration: 0.04, type: 'sine', volume: 0.05 },
  success: { freq: 880, duration: 0.12, type: 'sine', volume: 0.1 },
  alert: { freq: 440, duration: 0.15, type: 'square', volume: 0.08 },
  whoosh: { freq: 200, duration: 0.2, type: 'sawtooth', volume: 0.06 },
  notification: { freq: 660, duration: 0.1, type: 'sine', volume: 0.1 },
};

export const useSoundEffects = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const enabledRef = useRef(true);

  const playSound = useCallback((type: SoundType) => {
    if (!enabledRef.current) return;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const config = soundConfigs[type];
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = config.type;
      oscillator.frequency.setValueAtTime(config.freq, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        config.freq * 0.5,
        ctx.currentTime + config.duration
      );

      const volume = config.volume ?? 0.1;
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + config.duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + config.duration);
    } catch {
      // Silently fail if audio is not supported
    }
  }, []);

  const setEnabled = useCallback((enabled: boolean) => {
    enabledRef.current = enabled;
  }, []);

  return { playSound, setEnabled };
};

export default useSoundEffects;
