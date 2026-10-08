/**
 * window.speechSynthesis wrapper for paragraph narration and word-level highlighting
 * Provides robust state management between 'play', 'pause', and 'stop' states.
 */

export type PlaybackState = 'idle' | 'playing' | 'paused' | 'stopped';

export interface SpeechUtteranceCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
  onBoundary?: (charIndex: number, charLength?: number) => void;
  onPause?: () => void;
  onResume?: () => void;
}

export class SpeechSynthesisWrapper {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voice: SpeechSynthesisVoice | null = null;
  private state: PlaybackState = 'idle';
  private currentParagraphIndex: number | null = null;
  private callbacks: SpeechUtteranceCallbacks | null = null;
  private currentRate: number = 1.0;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Select best natural English voice available
    const preferred = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Natural') ||
          v.name.includes('Samantha') ||
          v.name.includes('Google US English') ||
          v.name.includes('Daniel') ||
          v.name.includes('Karen') ||
          v.name.includes('Serena') ||
          v.name.includes('Victoria'))
    );
    this.voice = preferred || voices.find((v) => v.lang.startsWith('en')) || voices[0] || null;
  }

  public isAvailable(): boolean {
    return !!this.synth;
  }

  public getState(): PlaybackState {
    return this.state;
  }

  public getCurrentParagraph(): number | null {
    return this.currentParagraphIndex;
  }

  /**
   * Play specific text for a given paragraph
   */
  public play(
    text: string,
    paragraphIndex: number,
    rate: number = 1.0,
    callbacks?: SpeechUtteranceCallbacks
  ): boolean {
    if (!this.synth) {
      console.warn('window.speechSynthesis is not available in this browser');
      return false;
    }

    // Stop any active speech first
    this.stop();

    this.currentParagraphIndex = paragraphIndex;
    this.currentRate = rate;
    this.callbacks = callbacks || null;

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.voice) {
      utterance.voice = this.voice;
    }
    utterance.lang = 'en-US';
    utterance.rate = rate;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      this.state = 'playing';
      callbacks?.onStart?.();
    };

    utterance.onend = () => {
      this.state = 'idle';
      this.currentParagraphIndex = null;
      this.currentUtterance = null;
      callbacks?.onEnd?.();
    };

    utterance.onerror = (e) => {
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.warn('SpeechSynthesis error:', e.error);
        callbacks?.onError?.(e);
      }
      this.state = 'idle';
      this.currentParagraphIndex = null;
      this.currentUtterance = null;
    };

    utterance.onpause = () => {
      this.state = 'paused';
      callbacks?.onPause?.();
    };

    utterance.onresume = () => {
      this.state = 'playing';
      callbacks?.onResume?.();
    };

    if (callbacks?.onBoundary) {
      utterance.onboundary = (e: SpeechSynthesisEvent) => {
        if (e.name === 'word' || e.charIndex !== undefined) {
          callbacks.onBoundary?.(e.charIndex, (e as any).charLength || 0);
        }
      };
    }

    this.currentUtterance = utterance;
    this.state = 'playing';
    this.synth.speak(utterance);
    return true;
  }

  /**
   * Pause the active speech
   */
  public pause(): void {
    if (this.synth && this.synth.speaking && this.state === 'playing') {
      this.synth.pause();
      this.state = 'paused';
      this.callbacks?.onPause?.();
    }
  }

  /**
   * Resume paused speech
   */
  public resume(): void {
    if (this.synth && this.state === 'paused') {
      this.synth.resume();
      this.state = 'playing';
      this.callbacks?.onResume?.();
    }
  }

  /**
   * Stop speech completely and reset to idle/stopped
   */
  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
    this.state = 'stopped';
    this.currentParagraphIndex = null;
    this.currentUtterance = null;
  }

  /**
   * Toggle between play and pause/stop for a specific paragraph
   * If paragraph is currently playing -> pause or stop it
   * If paragraph is paused -> resume it
   * If another paragraph is playing -> switch to this new paragraph
   */
  public toggleParagraph(
    text: string,
    paragraphIndex: number,
    rate: number = 1.0,
    callbacks?: SpeechUtteranceCallbacks
  ): PlaybackState {
    if (this.currentParagraphIndex === paragraphIndex) {
      if (this.state === 'playing') {
        this.pause();
        return 'paused';
      } else if (this.state === 'paused') {
        this.resume();
        return 'playing';
      } else {
        this.play(text, paragraphIndex, rate, callbacks);
        return 'playing';
      }
    } else {
      // Different paragraph: start playing it
      this.play(text, paragraphIndex, rate, callbacks);
      return 'playing';
    }
  }

  /**
   * Speak arbitrary text (convenience alias for word and sentence lookup)
   */
  public speak(
    text: string,
    options: { rate?: number; onEnd?: () => void; onError?: (e: any) => void } = {}
  ): boolean {
    if (!this.synth) return false;
    this.synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (this.voice) {
      utterance.voice = this.voice;
    }
    utterance.lang = 'en-US';
    utterance.rate = options.rate || 1.0;
    if (options.onEnd) utterance.onend = () => options.onEnd?.();
    if (options.onError) utterance.onerror = (e) => options.onError?.(e);
    this.synth.speak(utterance);
    return true;
  }

  /**
   * Quick utility to pronounce a single word or short phrase
   */
  public speakWord(word: string, rate: number = 0.85): void {
    if (!this.synth) return;
    this.synth.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    if (this.voice) {
      utterance.voice = this.voice;
    }
    utterance.lang = 'en-US';
    utterance.rate = rate;
    this.synth.speak(utterance);
  }
}

export const speechService = new SpeechSynthesisWrapper();
