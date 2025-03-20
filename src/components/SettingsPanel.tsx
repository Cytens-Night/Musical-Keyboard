import React, { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Volume2, Music, Palette, Sparkles, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./ui/dialog";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface SettingsPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  onApply?: (settings: any) => void;
}

const SettingsPanel = ({
  isOpen = false,
  onClose = () => {},
  onApply = () => {},
}: SettingsPanelProps) => {
  // Default state values for settings
  const [volume, setVolume] = useState<number[]>([80]);
  const [animationStyle, setAnimationStyle] = useState("ripple");
  const [particleEffects, setParticleEffects] = useState(true);
  const [colorGradients, setColorGradients] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState<number[]>([50]);

  // Music settings
  const [musicalScale, setMusicalScale] = useState("pentatonic");
  const [reverbAmount, setReverbAmount] = useState<number[]>([30]);
  const [delayAmount, setDelayAmount] = useState<number[]>([20]);
  const [harmoniesEnabled, setHarmoniesEnabled] = useState(true);

  const handleApply = () => {
    onApply({
      volume: volume[0],
      animationStyle,
      particleEffects,
      colorGradients,
      soundEnabled,
      animationSpeed: animationSpeed[0],
      musicalScale,
      reverbAmount: reverbAmount[0],
      delayAmount: delayAmount[0],
      harmoniesEnabled,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Customize your keyboard symphony experience
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="sound" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800">
            <TabsTrigger
              value="sound"
              className="data-[state=active]:bg-slate-700"
            >
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                <span>Sound</span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="visual"
              className="data-[state=active]:bg-slate-700"
            >
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span>Visual</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sound" className="space-y-6 py-4">
            {/* Basic Sound Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Enable Sound</label>
                <Switch
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Volume</label>
                  <span className="text-xs text-slate-400">{volume[0]}%</span>
                </div>
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  disabled={!soundEnabled}
                />
              </div>

              {/* Advanced Music Settings */}
              <div className="pt-2">
                <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
                  <Music className="h-4 w-4 text-indigo-400" />
                  <span>Musical Settings</span>
                </h4>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Musical Scale</label>
                    <Select
                      value={musicalScale}
                      onValueChange={setMusicalScale}
                      disabled={!soundEnabled}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700">
                        <SelectValue placeholder="Select scale" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700 text-white">
                        <SelectItem value="pentatonic">
                          Pentatonic (Smooth)
                        </SelectItem>
                        <SelectItem value="major">Major (Bright)</SelectItem>
                        <SelectItem value="minor">
                          Minor (Melancholic)
                        </SelectItem>
                        <SelectItem value="blues">Blues (Soulful)</SelectItem>
                        <SelectItem value="chromatic">
                          Chromatic (Complex)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Reverb</label>
                      <span className="text-xs text-slate-400">
                        {reverbAmount[0]}%
                      </span>
                    </div>
                    <Slider
                      value={reverbAmount}
                      onValueChange={setReverbAmount}
                      max={100}
                      step={1}
                      disabled={!soundEnabled}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Echo</label>
                      <span className="text-xs text-slate-400">
                        {delayAmount[0]}%
                      </span>
                    </div>
                    <Slider
                      value={delayAmount}
                      onValueChange={setDelayAmount}
                      max={100}
                      step={1}
                      disabled={!soundEnabled}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-yellow-400" />
                      <label className="text-sm font-medium">
                        Automatic Harmonies
                      </label>
                    </div>
                    <Switch
                      checked={harmoniesEnabled}
                      onCheckedChange={setHarmoniesEnabled}
                      disabled={!soundEnabled}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="visual" className="space-y-6 py-4">
            {/* Animation Settings */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Animation Style</label>
                <Select
                  value={animationStyle}
                  onValueChange={setAnimationStyle}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    <SelectItem value="ripple">Ripple</SelectItem>
                    <SelectItem value="pulse">Pulse</SelectItem>
                    <SelectItem value="burst">Burst</SelectItem>
                    <SelectItem value="wave">Wave</SelectItem>
                    <SelectItem value="spiral">Spiral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Animation Speed</label>
                  <span className="text-xs text-slate-400">
                    {animationSpeed[0] < 33
                      ? "Slow"
                      : animationSpeed[0] < 66
                        ? "Medium"
                        : "Fast"}
                  </span>
                </div>
                <Slider
                  value={animationSpeed}
                  onValueChange={setAnimationSpeed}
                  max={100}
                  step={1}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                  <label className="text-sm font-medium">
                    Particle Effects
                  </label>
                </div>
                <Switch
                  checked={particleEffects}
                  onCheckedChange={setParticleEffects}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Color Gradients</label>
                <Switch
                  checked={colorGradients}
                  onCheckedChange={setColorGradients}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={handleApply}
          >
            Apply Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsPanel;
