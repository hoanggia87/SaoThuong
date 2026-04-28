let ctx: AudioContext | null = null
let muted = false

function getCtx(): AudioContext | null {
  if (muted) return null
  if (!ctx) {
    const Ctor =
      typeof window !== 'undefined'
        ? window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
        : undefined
    if (!Ctor) return null
    ctx = new Ctor()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

export function setMuted(v: boolean) {
  muted = v
}

export function playTick() {
  const ac = getCtx()
  if (!ac) return
  const t = ac.currentTime
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = 'square'
  osc.frequency.setValueAtTime(880, t)
  osc.frequency.exponentialRampToValueAtTime(440, t + 0.04)
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(0.18, t + 0.005)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05)
  osc.connect(gain).connect(ac.destination)
  osc.start(t)
  osc.stop(t + 0.06)
}

export function playWin() {
  const ac = getCtx()
  if (!ac) return
  const t0 = ac.currentTime
  // Cheerful arpeggio: C5 - E5 - G5 - C6
  const notes = [523.25, 659.25, 783.99, 1046.5]
  notes.forEach((freq, i) => {
    const t = t0 + i * 0.09
    const osc = ac.createOscillator()
    const gain = ac.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(freq, t)
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(0.25, t + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35)
    osc.connect(gain).connect(ac.destination)
    osc.start(t)
    osc.stop(t + 0.4)
  })
}

export function playSpinStart() {
  const ac = getCtx()
  if (!ac) return
  const t = ac.currentTime
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(220, t)
  osc.frequency.exponentialRampToValueAtTime(660, t + 0.25)
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(0.15, t + 0.05)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.3)
  osc.connect(gain).connect(ac.destination)
  osc.start(t)
  osc.stop(t + 0.32)
}
