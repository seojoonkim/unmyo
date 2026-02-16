// Web Audio API sound generator for each character
export type CharacterSoundType = 'myo' | 'harin' | 'noeul' | 'yunha' | 'jiho' | 'seojin';

let audioCtx: AudioContext | null = null;
let activeNodes: AudioNode[] = [];
let isPlaying = false;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function createReverb(ctx: AudioContext, duration: number = 2): ConvolverNode {
  const convolver = ctx.createConvolver();
  const rate = ctx.sampleRate;
  const length = rate * duration;
  const impulse = ctx.createBuffer(2, length, rate);
  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
    }
  }
  convolver.buffer = impulse;
  return convolver;
}

// 묘(영적): sine wave + reverb ambient
function playMyo(ctx: AudioContext, gain: GainNode) {
  const osc = ctx.createOscillator();
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 220;
  lfo.type = 'sine';
  lfo.frequency.value = 0.3;
  lfoGain.gain.value = 15;
  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);
  const reverb = createReverb(ctx, 3);
  osc.connect(reverb);
  reverb.connect(gain);
  osc.start();
  lfo.start();
  activeNodes.push(osc, lfo);
}

// 하린(연애): warm lofi tone
function playHarin(ctx: AudioContext, gain: GainNode) {
  const osc = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.value = 293.66; // D4
  osc2.type = 'sine';
  osc2.frequency.value = 440; // A4
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 800;
  filter.Q.value = 2;
  const merger = ctx.createGain();
  merger.gain.value = 0.5;
  osc.connect(merger);
  osc2.connect(merger);
  merger.connect(filter);
  const reverb = createReverb(ctx, 2);
  filter.connect(reverb);
  reverb.connect(gain);
  osc.start();
  osc2.start();
  activeNodes.push(osc, osc2);
}

// 노을(지혜): filtered white noise (rain)
function playNoeul(ctx: AudioContext, gain: GainNode) {
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 3000;
  filter.Q.value = 0.5;
  source.connect(filter);
  filter.connect(gain);
  source.start();
  activeNodes.push(source as unknown as AudioNode);
}

// 윤하(성장): bright chime
function playYunha(ctx: AudioContext, gain: GainNode) {
  function chime() {
    if (!isPlaying) return;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    const freqs = [523.25, 659.25, 783.99, 1046.5];
    osc.type = 'sine';
    osc.frequency.value = freqs[Math.floor(Math.random() * freqs.length)];
    env.gain.setValueAtTime(0.3, ctx.currentTime);
    env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
    osc.connect(env);
    const reverb = createReverb(ctx, 2);
    env.connect(reverb);
    reverb.connect(gain);
    osc.start();
    osc.stop(ctx.currentTime + 2);
    setTimeout(chime, 2000 + Math.random() * 3000);
  }
  chime();
}

// 지호(현실): minimal click
function playJiho(ctx: AudioContext, gain: GainNode) {
  function click() {
    if (!isPlaying) return;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 800;
    env.gain.setValueAtTime(0.2, ctx.currentTime);
    env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(env);
    env.connect(gain);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
    setTimeout(click, 1500 + Math.random() * 2000);
  }
  click();
}

// 서진(팩트): calm tone
function playSeojin(ctx: AudioContext, gain: GainNode) {
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = 174.61; // F3
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 400;
  osc.connect(filter);
  filter.connect(gain);
  osc.start();
  activeNodes.push(osc);
}

export function startSound(characterId: string): void {
  stopSound();
  isPlaying = true;
  const ctx = getAudioContext();
  const gain = ctx.createGain();
  gain.gain.value = 0.15;
  gain.connect(ctx.destination);
  activeNodes.push(gain);

  const players: Record<string, (ctx: AudioContext, gain: GainNode) => void> = {
    myo: playMyo,
    harin: playHarin,
    noeul: playNoeul,
    yunha: playYunha,
    jiho: playJiho,
    seojin: playSeojin,
  };

  const player = players[characterId];
  if (player) player(ctx, gain);
}

export function stopSound(): void {
  isPlaying = false;
  activeNodes.forEach((node) => {
    try {
      if ('stop' in node && typeof (node as OscillatorNode).stop === 'function') {
        (node as OscillatorNode).stop();
      }
      node.disconnect();
    } catch {
      // already stopped
    }
  });
  activeNodes = [];
}

export function triggerHaptic(): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(50);
  }
}
