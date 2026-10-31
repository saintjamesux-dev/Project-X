/**
 * A gentle music-box rendition of "Happy Birthday" synthesised with the
 * Web Audio API — no audio files, and it only plays when the visitor asks.
 */

// [semitones from A4, beats]
const MELODY: [number, number][] = [
  [-2, 0.75], [-2, 0.25], [0, 1], [-2, 1], [3, 1], [2, 2],
  [-2, 0.75], [-2, 0.25], [0, 1], [-2, 1], [5, 1], [3, 2],
  [-2, 0.75], [-2, 0.25], [10, 1], [7, 1], [3, 1], [2, 1], [0, 2],
  [8, 0.75], [8, 0.25], [7, 1], [3, 1], [5, 1], [3, 3],
];

const BEAT = 0.52;
const PHRASE_GAP = 2.5;

export class MusicBox {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private timer: number | null = null;
  playing = false;

  private ensure() {
    if (!this.ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.0001;
      this.master.connect(this.ctx.destination);
    }
    return { ctx: this.ctx, master: this.master! };
  }

  private note(freq: number, at: number, length: number) {
    const { ctx, master } = this.ensure();
    // Two slightly detuned partials give a soft, bell-like music-box tone.
    for (const [mult, level] of [[1, 0.5], [2.005, 0.12], [3.01, 0.04]] as const) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq * mult;
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(level, at + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + Math.max(length, 0.4) + 0.9);
      osc.connect(gain).connect(master);
      osc.start(at);
      osc.stop(at + length + 1.2);
    }
  }

  private schedule() {
    const { ctx } = this.ensure();
    let t = ctx.currentTime + 0.15;
    for (const [semi, beats] of MELODY) {
      this.note(440 * Math.pow(2, semi / 12), t, beats * BEAT);
      t += beats * BEAT;
    }
    const total = (t - ctx.currentTime + PHRASE_GAP) * 1000;
    this.timer = window.setTimeout(() => this.playing && this.schedule(), total);
  }

  async play() {
    const { ctx } = this.ensure();
    // A fresh output node per session, so notes queued before a pause stay silent.
    this.master?.disconnect();
    const master = ctx.createGain();
    master.connect(ctx.destination);
    this.master = master;
    if (ctx.state === "suspended") await ctx.resume();
    this.playing = true;
    master.gain.setValueAtTime(0.0001, ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(0.32, ctx.currentTime + 0.6);
    this.schedule();
  }

  pause() {
    if (!this.ctx || !this.master) return;
    this.playing = false;
    if (this.timer) window.clearTimeout(this.timer);
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(Math.max(this.master.gain.value, 0.0001), now);
    this.master.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    // Suspend after the fade so scheduled notes do not linger.
    window.setTimeout(() => {
      if (!this.playing) this.ctx?.suspend();
    }, 600);
  }
}
