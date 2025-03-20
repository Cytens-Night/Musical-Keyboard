import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface KeyVisualizerProps {
  keyPressed?: string;
  color?: string;
  size?: number;
  duration?: number;
  playSound?: boolean;
}

const KeyVisualizer: React.FC<KeyVisualizerProps> = ({
  keyPressed = "A",
  color = "#6366f1",
  size = 100,
  duration = 0.8,
  playSound = true,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // Generate a unique animation based on the key pressed
  const getAnimationVariants = () => {
    // Create different animation patterns based on the key's character code
    const charCode = keyPressed.charCodeAt(0);
    const scale = 1 + (charCode % 5) / 10; // Scale between 1.0 and 1.4
    const rotate = (charCode % 8) * 45; // Rotate by 0, 45, 90, 135, 180, 225, 270, or 315 degrees

    return {
      initial: { scale: 0.2, opacity: 0, rotate: 0 },
      animate: {
        scale: scale,
        opacity: 1,
        rotate: rotate,
        transition: { duration: duration },
      },
      exit: {
        scale: 1.5,
        opacity: 0,
        transition: { duration: duration / 2 },
      },
    };
  };

  // Generate a color based on the key pressed if no color is provided
  const getKeyColor = () => {
    if (color !== "#6366f1") return color;

    const hue = (keyPressed.charCodeAt(0) * 15) % 360;
    return `hsl(${hue}, 80%, 60%)`;
  };

  useEffect(() => {
    if (keyPressed) {
      setIsAnimating(true);

      // Play sound if enabled
      if (playSound) {
        const audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        // Calculate frequency based on key (simple mapping to create musical notes)
        const baseFrequency = 261.63; // Middle C
        const keyCode = keyPressed.charCodeAt(0);
        const frequency = baseFrequency * Math.pow(2, (keyCode % 12) / 12);

        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        gainNode.gain.value = 0.1;

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(
          0.001,
          audioContext.currentTime + 0.5,
        );

        setTimeout(() => {
          oscillator.stop();
          setIsAnimating(false);
        }, duration * 1000);
      } else {
        setTimeout(() => setIsAnimating(false), duration * 1000);
      }
    }
  }, [keyPressed, duration, playSound]);

  return (
    <div
      className="relative flex items-center justify-center bg-gray-900"
      style={{ width: size, height: size }}
    >
      {isAnimating && (
        <motion.div
          className="absolute rounded-full"
          style={{
            backgroundColor: getKeyColor(),
            width: size * 0.8,
            height: size * 0.8,
          }}
          variants={getAnimationVariants()}
          initial="initial"
          animate="animate"
          exit="exit"
        />
      )}
      <div className="absolute text-white font-bold text-2xl z-10">
        {keyPressed}
      </div>

      {/* Particle effects */}
      {isAnimating && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                backgroundColor: getKeyColor(),
                width: size * 0.1,
                height: size * 0.1,
              }}
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{
                x: Math.cos((i * Math.PI) / 4) * size * 0.6,
                y: Math.sin((i * Math.PI) / 4) * size * 0.6,
                opacity: 0,
                scale: 0,
              }}
              transition={{ duration: duration * 0.8 }}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default KeyVisualizer;
