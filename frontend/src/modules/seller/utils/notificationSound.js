let audioCtx = null;
let primed = false;

function getAudioContext() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

export function primeNotificationAudio() {
  const ctx = getAudioContext();
  if (!ctx) return false;
  primed = true;
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  return true;
}

export async function playNewOrderChime({ volume = 0.18 } = {}) {
  const ctx = getAudioContext();
  if (!ctx) return false;

  // Most browsers require a user gesture before audio can play.
  if (!primed) primeNotificationAudio();
  if (ctx.state === 'suspended') {
    try {
      await ctx.resume();
    } catch {
      return false;
    }
  }

  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(volume, now + 0.02);
  master.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);
  master.connect(ctx.destination);

  const playTone = (freq, start, dur, type = 'sine') => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now + start);
    gain.gain.setValueAtTime(0.0001, now + start);
    gain.gain.exponentialRampToValueAtTime(0.9, now + start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
    osc.connect(gain);
    gain.connect(master);
    osc.start(now + start);
    osc.stop(now + start + dur);
  };

  // Warm "luxury" chime: small arpeggio + soft tail
  playTone(659.25, 0.0, 0.14, 'sine'); // E5
  playTone(987.77, 0.05, 0.18, 'triangle'); // B5
  playTone(1318.51, 0.12, 0.22, 'sine'); // E6
  playTone(880.0, 0.33, 0.26, 'sine'); // A5

  return true;
}

export function isSoundEnabled() {
  const raw = localStorage.getItem('seller_notification_sound');
  return raw == null ? true : raw === 'true';
}

export function setSoundEnabled(enabled) {
  localStorage.setItem('seller_notification_sound', String(!!enabled));
}

