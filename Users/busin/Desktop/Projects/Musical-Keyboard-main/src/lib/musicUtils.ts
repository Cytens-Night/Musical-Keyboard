import * as Tone from "tone";

// Musical scales for harmonious sounds
const SCALES = {
  major: ["C", "D", "E", "F", "G", "A", "B"],
  minor: ["C", "D", "Eb", "F", "G", "Ab", "Bb"],
  pentatonic: ["C", "D", "E", "G", "A"],
  blues: ["C", "Eb", "F", "F#", "G", "Bb"],
  chromatic: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
};

// Octave ranges for different key groups
const OCTAVE_RANGES = {
  letters: { min: 3, max: 5 }, // A-Z keys
  numbers: { min: 2, max: 4 }, // 0-9 keys
  special: { min: 1, max: 3 }, // Special character keys
};

// Chord progressions for harmonious sequences
const CHORD_PROGRESSIONS = [
  ["C", "G", "Am", "F"], // I-V-vi-IV (Pop progression)
  ["Am", "F", "C", "G"], // vi-IV-I-V
  ["C", "Am", "F", "G"], // I-vi-IV-V (50s progression)
  ["C", "F", "G"], // I-IV-V (Blues progression)
  ["Cm", "G", "Cm"], // i-V-i (Minor progression)
];

// Initialize Tone.js synth and effects
let synth: Tone.PolySynth | null = null;
let reverb: Tone.Reverb | null = null;
let delay: Tone.FeedbackDelay | null = null;

// Current musical context
let currentScale = "pentatonic";
let currentOctave = 4;
let currentProgression = 0;
let progressionIndex = 0;
let lastNotesPlayed: string[] = [];
let notesInQueue: { note: string; time: number }[] = [];

// Initialize the audio engine
export const initAudioEngine = async (volume = 0.5) => {
  // Only initialize once
  if (synth) return;

  try {
    // Force start the audio context
    await Tone.start();
    console.log("Tone.js started successfully");

    // Create a polyphonic synth for playing multiple notes
    synth = new Tone.PolySynth(Tone.Synth).toDestination();
    synth.volume.value = Tone.gainToDb(volume);

    // Add reverb for spaciousness
    reverb = new Tone.Reverb({
      decay: 2.5,
      wet: 0.3,
    }).toDestination();

    // Add delay for echo effect
    delay = new Tone.FeedbackDelay({
      delayTime: 0.25,
      feedback: 0.2,
      wet: 0.2,
    }).toDestination();

    // Connect synth to effects
    synth.connect(reverb);
    synth.connect(delay);

    // Start the transport for timing
    Tone.Transport.start();

    // Play a silent note to fully initialize the audio context
    synth.triggerAttackRelease("C4", 0.01, Tone.now(), 0.01);

    console.log("Audio engine initialized successfully");
  } catch (error) {
    console.error("Failed to initialize audio engine:", error);
  }
};

// Map a key to a musical note based on current scale and context
export const keyToNote = (key: string): string => {
  const scale = SCALES[currentScale as keyof typeof SCALES];
  let octave = currentOctave;

  // Determine character type and adjust octave
  if (/[A-Z]/i.test(key)) {
    // For letter keys, map A-G directly to notes when possible
    const letterIndex = key.toUpperCase().charCodeAt(0) - 65; // A=0, B=1, etc.
    const noteIndex = letterIndex % scale.length;
    octave = OCTAVE_RANGES.letters.min + Math.floor(letterIndex / scale.length);
    if (octave > OCTAVE_RANGES.letters.max) octave = OCTAVE_RANGES.letters.max;
    return `${scale[noteIndex]}${octave}`;
  } else if (/[0-9]/.test(key)) {
    // For number keys
    const numIndex = parseInt(key) % scale.length;
    octave =
      OCTAVE_RANGES.numbers.min + Math.floor(parseInt(key) / scale.length);
    if (octave > OCTAVE_RANGES.numbers.max) octave = OCTAVE_RANGES.numbers.max;
    return `${scale[numIndex]}${octave}`;
  } else {
    // For special characters, use character code
    const charCode = key.charCodeAt(0);
    const noteIndex = charCode % scale.length;
    octave = OCTAVE_RANGES.special.min + Math.floor((charCode % 20) / 10);
    if (octave > OCTAVE_RANGES.special.max) octave = OCTAVE_RANGES.special.max;
    return `${scale[noteIndex]}${octave}`;
  }
};

// Play a note with the current synth
export const playNote = (key: string, duration = 0.5, velocity = 0.7) => {
  if (!synth) {
    console.warn("Synth not initialized when attempting to play note");
    // Try to initialize the synth if it's not already initialized
    initAudioEngine()
      .then(() => {
        console.log("Audio engine initialized on demand");
      })
      .catch((err) => {
        console.error("Failed to initialize audio engine on demand:", err);
      });
    return;
  }

  try {
    const note = keyToNote(key);
    console.log(
      `Playing note: ${note} with duration ${duration} and velocity ${velocity}`,
    );

    // Add note to our recently played notes
    lastNotesPlayed = [...lastNotesPlayed, note].slice(-8); // Keep last 8 notes

    // Add to queue for harmony generation
    notesInQueue.push({ note, time: Tone.now() });

    // Clean up old notes from queue (older than 2 seconds)
    const now = Tone.now();
    notesInQueue = notesInQueue.filter((n) => now - n.time < 2);

    // Play the note
    synth.triggerAttackRelease(note, duration, Tone.now(), velocity);

    // Occasionally add a harmony note if we have multiple keys pressed
    if (notesInQueue.length > 1 && Math.random() > 0.6) {
      generateHarmony();
    }

    // Progress through chord progression if enough time has passed
    progressChordSequence();
  } catch (error) {
    console.error("Error playing note:", error);
  }
};

// Generate a harmony note based on current context
const generateHarmony = () => {
  if (!synth || notesInQueue.length < 2) return;

  const scale = SCALES[currentScale as keyof typeof SCALES];
  const lastNote = lastNotesPlayed[lastNotesPlayed.length - 1];

  if (!lastNote) return;

  // Extract note name and octave
  const noteName = lastNote.slice(0, -1);
  const octave = parseInt(lastNote.slice(-1));

  // Find position in scale
  const noteIndex = scale.indexOf(noteName);
  if (noteIndex === -1) return;

  // Generate harmony notes (3rd and 5th intervals are harmonious)
  const thirdIndex = (noteIndex + 2) % scale.length;
  const fifthIndex = (noteIndex + 4) % scale.length;

  // Adjust octave for wrap-around
  const thirdOctave = thirdIndex < noteIndex ? octave + 1 : octave;
  const fifthOctave = fifthIndex < noteIndex ? octave + 1 : octave;

  // Play harmony notes with slight delay and lower velocity
  setTimeout(() => {
    synth?.triggerAttackRelease(
      `${scale[thirdIndex]}${thirdOctave}`,
      0.4,
      Tone.now(),
      0.4,
    );
  }, 50);

  setTimeout(() => {
    synth?.triggerAttackRelease(
      `${scale[fifthIndex]}${fifthOctave}`,
      0.3,
      Tone.now(),
      0.3,
    );
  }, 100);
};

// Progress through a chord sequence for background harmony
const progressChordSequence = () => {
  if (!synth) return;

  // Only change chords occasionally
  if (Math.random() > 0.2) return;

  const progression = CHORD_PROGRESSIONS[currentProgression];
  const chord = progression[progressionIndex];

  // Move to next chord in progression
  progressionIndex = (progressionIndex + 1) % progression.length;

  // Play chord very softly in the background
  const chordNotes = getChordNotes(chord);
  synth.triggerAttackRelease(chordNotes, 1.5, Tone.now(), 0.1);
};

// Get notes for a chord
const getChordNotes = (chordName: string): string[] => {
  // Basic chord mapping
  const root = chordName.charAt(0);
  const isMinor = chordName.includes("m");
  const baseOctave = 2; // Low octave for background chords

  // Major chord: root, major third, perfect fifth
  // Minor chord: root, minor third, perfect fifth
  const third = isMinor ? 3 : 4; // Semitones: 3 for minor, 4 for major

  // Map root note to chromatic index
  const chromaticScale = SCALES.chromatic;
  const rootIndex = chromaticScale.indexOf(root);
  if (rootIndex === -1) return [`${root}${baseOctave}`]; // Fallback

  const thirdNote = chromaticScale[(rootIndex + third) % 12];
  const fifthNote = chromaticScale[(rootIndex + 7) % 12]; // Perfect fifth is always 7 semitones

  return [
    `${root}${baseOctave}`,
    `${thirdNote}${baseOctave}`,
    `${fifthNote}${baseOctave}`,
  ];
};

// Update settings
export const updateMusicSettings = (settings: {
  volume?: number;
  scale?: string;
  reverb?: number;
  delay?: number;
}) => {
  if (!synth || !reverb || !delay) return;

  if (settings.volume !== undefined) {
    synth.volume.value = Tone.gainToDb(settings.volume);
  }

  if (
    settings.scale !== undefined &&
    SCALES[settings.scale as keyof typeof SCALES]
  ) {
    currentScale = settings.scale;
  }

  if (settings.reverb !== undefined) {
    reverb.wet.value = settings.reverb;
  }

  if (settings.delay !== undefined) {
    delay.wet.value = settings.delay;
  }

  // Randomly change progression occasionally
  if (Math.random() > 0.7) {
    currentProgression = Math.floor(Math.random() * CHORD_PROGRESSIONS.length);
    progressionIndex = 0;
  }
};

// Clean up resources
export const cleanupAudioEngine = () => {
  if (synth) {
    synth.dispose();
    synth = null;
  }

  if (reverb) {
    reverb.dispose();
    reverb = null;
  }

  if (delay) {
    delay.dispose();
    delay = null;
  }

  Tone.Transport.stop();
};
