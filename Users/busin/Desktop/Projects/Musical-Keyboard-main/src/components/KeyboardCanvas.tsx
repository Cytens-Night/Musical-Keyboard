import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import * as Tone from "tone";
import {
  initAudioEngine,
  playNote,
  updateMusicSettings,
  cleanupAudioEngine,
} from "../lib/musicUtils";

// Define the Settings interface here since we can't import it
interface Settings {
  animationStyle: string;
  soundEnabled: boolean;
  particleEffects: boolean;
  colorScheme: string;
  volume: number;
}

// Define the KeyVisualizer props interface
interface KeyVisualizerProps {
  keyChar: string;
  position: { x: number; y: number };
  color: string;
  animationStyle: string;
  particleEffects: boolean;
  onAnimationComplete: () => void;
}

// Create a simple KeyVisualizer component
const KeyVisualizer: React.FC<KeyVisualizerProps> = ({
  keyChar,
  position,
  color,
  animationStyle = "ripple",
  particleEffects = true,
  onAnimationComplete,
}) => {
  const variants = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 2, opacity: 0 },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{ duration: 1 }}
      onAnimationComplete={onAnimationComplete}
      className="absolute flex items-center justify-center rounded-full"
      style={{
        left: position.x,
        top: position.y,
        width: 100,
        height: 100,
        backgroundColor: color,
        boxShadow: particleEffects ? `0 0 20px ${color}` : "none",
      }}
    >
      <span className="text-white text-3xl font-bold">{keyChar}</span>

      {/* Particle effects */}
      {particleEffects && (
        <motion.div
          className="absolute inset-0 rounded-full"
          initial={{ opacity: 0.7, scale: 1 }}
          animate={{ opacity: 0, scale: 2 }}
          transition={{ duration: 1.5, repeat: 0 }}
          style={{ backgroundColor: color }}
        />
      )}
    </motion.div>
  );
};

interface KeyboardCanvasProps {
  isActive?: boolean;
  settings?: Settings;
  onEscapePressed?: () => void;
}

interface KeyState {
  key: string;
  id: string;
  x: number;
  y: number;
  color: string;
  timestamp: number;
}

const DEFAULT_SETTINGS: Settings = {
  animationStyle: "ripple",
  soundEnabled: true,
  particleEffects: true,
  colorScheme: "rainbow",
  volume: 80,
};

const KeyboardCanvas: React.FC<KeyboardCanvasProps> = ({
  isActive = true,
  settings = DEFAULT_SETTINGS,
  onEscapePressed = () => {},
}) => {
  const [activeKeys, setActiveKeys] = useState<KeyState[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [audioInitialized, setAudioInitialized] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const lastKeyPressTime = useRef<number>(0);

  // Generate a random color based on the key pressed
  const getRandomColor = useCallback(() => {
    const colors = [
      "#FF5252",
      "#FF4081",
      "#E040FB",
      "#7C4DFF",
      "#536DFE",
      "#448AFF",
      "#40C4FF",
      "#18FFFF",
      "#64FFDA",
      "#69F0AE",
      "#B2FF59",
      "#EEFF41",
      "#FFFF00",
      "#FFD740",
      "#FFAB40",
      "#FF6E40",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  // Initialize audio engine when component mounts
  useEffect(() => {
    if (isActive && settings.soundEnabled && !audioInitialized) {
      const initAudio = async () => {
        await initAudioEngine(settings.volume / 100);
        setAudioInitialized(true);
      };

      // Initialize audio immediately
      initAudio();
    }

    // Update music settings when they change
    if (audioInitialized) {
      updateMusicSettings({
        volume: settings.volume / 100,
        scale: settings.colorScheme === "rainbow" ? "pentatonic" : "major",
        reverb: 0.3,
        delay: 0.2,
      });
    }

    return () => {
      cleanupAudioEngine();
    };
  }, [isActive, settings, audioInitialized]);

  // Handle key press events
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isActive) return;

      // Handle ESC key to exit
      if (event.key === "Escape") {
        onEscapePressed();
        return;
      }

      // Prevent adding duplicate keys
      if (activeKeys.some((k) => k.key === event.key)) return;

      // Initialize audio on first interaction if not already initialized
      if (!audioInitialized) {
        initAudioEngine(settings.volume / 100)
          .then(() => {
            setAudioInitialized(true);
            console.log("Audio initialized on key press");
            // Play a test note to ensure audio is working
            if (settings.soundEnabled) {
              playNote("A", 0.3, 0.5);
            }
          })
          .catch((err) => {
            console.error("Failed to initialize audio on key press:", err);
          });
      }

      // Generate random position within the canvas
      const canvasWidth = dimensions.width;
      const canvasHeight = dimensions.height;
      const x = Math.random() * (canvasWidth - 100) + 50;
      const y = Math.random() * (canvasHeight - 100) + 50;

      // Create new key state
      const newKey: KeyState = {
        key: event.key,
        id: `${event.key}-${Date.now()}`,
        x,
        y,
        color: getRandomColor(),
        timestamp: Date.now(),
      };

      setActiveKeys((prev) => [...prev, newKey]);

      // Calculate time since last keypress to adjust note duration
      const now = Date.now();
      const timeSinceLastPress = now - lastKeyPressTime.current;
      lastKeyPressTime.current = now;

      // Adjust note duration based on typing speed
      // Faster typing = shorter notes for a more staccato feel
      let noteDuration = 0.5; // default duration
      if (timeSinceLastPress < 200) {
        noteDuration = 0.3; // shorter for fast typing
      } else if (timeSinceLastPress > 1000) {
        noteDuration = 0.8; // longer for slow, deliberate presses
      }

      // Play the musical note with our enhanced system
      if (settings.soundEnabled) {
        playNote(event.key, noteDuration);
      }
    },
    [
      activeKeys,
      dimensions,
      getRandomColor,
      isActive,
      onEscapePressed,
      settings.soundEnabled,
      settings.volume,
      audioInitialized,
    ],
  );

  // Remove keys after animation completes
  const removeKey = useCallback((id: string) => {
    setActiveKeys((prev) => prev.filter((key) => key.id !== id));
  }, []);

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        setDimensions({
          width: canvasRef.current.offsetWidth,
          height: canvasRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  // Set up and clean up keyboard event listeners
  useEffect(() => {
    if (isActive) {
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [handleKeyDown, isActive]);

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full bg-black overflow-hidden"
      style={{ minHeight: "500px" }}
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20" />

      {/* Instruction overlay when no keys are pressed */}
      {activeKeys.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          className="absolute inset-0 flex items-center justify-center text-white text-2xl font-light text-center px-6"
        >
          Press any key to create a symphony of sound and color
          <br />
          <span className="text-base mt-2 opacity-80">
            Type quickly for melodies, hold keys for harmonies
          </span>
        </motion.div>
      )}

      {/* Render active key visualizers */}
      {activeKeys.map((keyState) => (
        <KeyVisualizer
          key={keyState.id}
          keyChar={keyState.key}
          position={{ x: keyState.x, y: keyState.y }}
          color={keyState.color}
          animationStyle={settings.animationStyle}
          particleEffects={settings.particleEffects}
          onAnimationComplete={() => removeKey(keyState.id)}
        />
      ))}
    </div>
  );
};

export default KeyboardCanvas;
