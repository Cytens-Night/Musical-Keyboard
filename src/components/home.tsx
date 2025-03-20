import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Music } from "lucide-react";
import WelcomeScreen from "./WelcomeScreen";
import KeyboardCanvas from "./KeyboardCanvas";
import SettingsPanel from "./SettingsPanel";
import InstructionsOverlay from "./InstructionsOverlay";
import { updateMusicSettings } from "../lib/musicUtils";

// Define the Settings interface
interface Settings {
  animationStyle: string;
  soundEnabled: boolean;
  particleEffects: boolean;
  colorScheme: string;
  volume: number;
  musicalScale?: string;
  reverbAmount?: number;
  delayAmount?: number;
  harmoniesEnabled?: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  animationStyle: "ripple",
  soundEnabled: true,
  particleEffects: true,
  colorScheme: "rainbow",
  volume: 80,
  musicalScale: "pentatonic",
  reverbAmount: 30,
  delayAmount: 20,
  harmoniesEnabled: true,
};

const Home: React.FC = () => {
  const [appState, setAppState] = useState<"welcome" | "active">("welcome");
  const [showInstructions, setShowInstructions] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [musicMode, setMusicMode] = useState<
    "piano" | "ambient" | "electronic"
  >("piano");

  const handleStart = () => {
    setAppState("active");
  };

  const handleShowInstructions = () => {
    setShowInstructions(true);
  };

  const handleEscapePressed = () => {
    setAppState("welcome");
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleApplySettings = (newSettings: any) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));

    // Update music settings in the audio engine
    updateMusicSettings({
      volume: newSettings.volume / 100,
      scale: newSettings.musicalScale || "pentatonic",
      reverb: newSettings.reverbAmount / 100,
      delay: newSettings.delayAmount / 100,
    });
  };

  const cycleMusicMode = () => {
    const modes: Array<"piano" | "ambient" | "electronic"> = [
      "piano",
      "ambient",
      "electronic",
    ];
    const currentIndex = modes.indexOf(musicMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setMusicMode(modes[nextIndex]);

    // Update settings based on music mode
    switch (modes[nextIndex]) {
      case "piano":
        updateMusicSettings({
          scale: "pentatonic",
          reverb: 0.3,
          delay: 0.2,
        });
        break;
      case "ambient":
        updateMusicSettings({
          scale: "minor",
          reverb: 0.7,
          delay: 0.4,
        });
        break;
      case "electronic":
        updateMusicSettings({
          scale: "chromatic",
          reverb: 0.2,
          delay: 0.5,
        });
        break;
    }
  };

  return (
    <div className="min-h-screen w-full bg-black overflow-hidden">
      {appState === "welcome" ? (
        <WelcomeScreen
          onStart={handleStart}
          onShowInstructions={handleShowInstructions}
        />
      ) : (
        <div className="relative w-full h-screen">
          <KeyboardCanvas
            isActive={true}
            settings={settings}
            onEscapePressed={handleEscapePressed}
          />

          {/* Settings button */}
          <motion.button
            className="absolute top-4 right-4 p-3 rounded-full bg-slate-800/50 backdrop-blur-sm text-white hover:bg-slate-700/70 z-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSettings}
          >
            <SettingsIcon className="h-6 w-6" />
          </motion.button>

          {/* Music mode button */}
          <motion.button
            className="absolute top-4 right-16 p-3 rounded-full bg-slate-800/50 backdrop-blur-sm text-white hover:bg-slate-700/70 z-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={cycleMusicMode}
          >
            <Music className="h-6 w-6" />
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs bg-slate-800/80 px-2 py-1 rounded whitespace-nowrap">
              {musicMode === "piano"
                ? "Piano"
                : musicMode === "ambient"
                  ? "Ambient"
                  : "Electronic"}
            </span>
          </motion.button>

          {/* Instructions text */}
          <motion.div
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/70 text-sm bg-slate-900/50 backdrop-blur-sm px-4 py-2 rounded-full z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Press ESC to return to welcome screen
          </motion.div>
        </div>
      )}

      {/* Modals */}
      <InstructionsOverlay
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
      />

      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onApply={handleApplySettings}
      />
    </div>
  );
};

export default Home;
