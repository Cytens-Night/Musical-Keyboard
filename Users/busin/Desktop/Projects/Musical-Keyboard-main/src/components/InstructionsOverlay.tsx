import React from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";

interface InstructionsOverlayProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const InstructionsOverlay = ({
  isOpen = true,
  onClose = () => {},
}: InstructionsOverlayProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-slate-900 text-white border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-purple-400">
            How to Use Keyboard Symphony
          </DialogTitle>
          <Button
            variant="ghost"
            className="absolute right-4 top-4 text-slate-400 hover:text-white hover:bg-slate-800"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <DialogDescription className="text-slate-300 space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-purple-300">
              Getting Started
            </h3>
            <p>
              Simply start typing on your keyboard to create a symphony of
              sounds and visuals!
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-purple-300">
              Key Controls
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Each key produces a unique sound and animation</li>
              <li>Press multiple keys to create chord-like effects</li>
              <li>
                Press{" "}
                <span className="bg-slate-800 px-2 py-0.5 rounded">ESC</span> to
                exit the application
              </li>
              <li>
                Press{" "}
                <span className="bg-slate-800 px-2 py-0.5 rounded">Space</span>{" "}
                for a special visual effect
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-purple-300">Settings</h3>
            <p>Use the settings panel to customize:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Animation styles and colors</li>
              <li>Sound volume and effects</li>
              <li>Visual effects intensity</li>
              <li>Background themes</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-purple-300">Tips</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Try typing rhythmically to create musical patterns</li>
              <li>Experiment with different key combinations</li>
              <li>Hold keys longer for sustained notes and animations</li>
            </ul>
          </div>
        </DialogDescription>

        <DialogFooter className="flex justify-center pt-4">
          <Button
            onClick={onClose}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8"
          >
            Start Creating
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InstructionsOverlay;
