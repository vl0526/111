// A simple background music generator.  This implementation uses the Web
// Audio API to generate a looping melody with a retro feel.  When using
// this in a production environment consider replacing it with streamed
// audio for better fidelity and memory usage.

const NOTE_C4 = 261.63;
const NOTE_E4 = 329.63;
const NOTE_G4 = 392.0;
const NOTE_A4 = 440.0;

const melody = [
  { note: NOTE_G4, duration: 0.25 },
  { note: NOTE_A4, duration: 0.25 },
  { note: NOTE_G4, duration: 0.25 },
  { note: NOTE_E4, duration: 0.25 },
  { note: NOTE_C4, duration: 0.5 },
  { note: null, duration: 0.25 }, // Rest
  { note: NOTE_E4, duration: 0.25 },
  { note: NOTE_G4, duration: 0.5 },
  { note: null, duration: 0.5 }, // Rest
];

const BPM = 130;
const NOTE_TIME = 60 / BPM; // seconds per beat

class MusicPlayer {
  private audioContext: AudioContext | null = null;
  private isPlaying = false;
  private gainNode: GainNode | null = null;
  private currentNoteIndex = 0;
  private timeoutId: number | null = null;

  private initializeAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = 0.08; // Lower volume for background music
      this.gainNode.connect(this.audioContext.destination);
    }
  }

  private playNote(frequency: number | null, duration: number) {
    if (!this.audioContext || !this.gainNode || frequency === null) return;
    const oscillator = this.audioContext.createOscillator();
    oscillator.connect(this.gainNode);
    oscillator.type = 'triangle'; // A softer, more "chiptune" sound
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration * 0.9); // a little gap between notes
  }

  private scheduleNextNote() {
    if (!this.isPlaying) return;
    const { note, duration } = melody[this.currentNoteIndex];
    const durationInMs = duration * NOTE_TIME * 1000;
    this.playNote(note, durationInMs / 1000);
    this.currentNoteIndex = (this.currentNoteIndex + 1) % melody.length;
    this.timeoutId = window.setTimeout(() => {
      this.scheduleNextNote();
    }, durationInMs);
  }

  public play() {
    this.initializeAudioContext();
    if (!this.audioContext || this.isPlaying) return;
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    this.isPlaying = true;
    this.currentNoteIndex = 0;
    this.scheduleNextNote();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  public toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
  }
}

export default MusicPlayer;
