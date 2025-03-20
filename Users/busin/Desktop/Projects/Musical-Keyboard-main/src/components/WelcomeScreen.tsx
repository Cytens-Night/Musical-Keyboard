import React from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Music, Keyboard, Settings, Info } from "lucide-react";
import { motion } from "framer-motion";

interface WelcomeScreenProps {
  onStart?: () => void;
  onShowInstructions?: () => void;
  appTitle?: string;
  appDescription?: string;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStart = () => {},
  onShowInstructions = () => {},
  appTitle = "Keyboard Symphony",
  appDescription = "Transform your keystrokes into a beautiful symphony of colors and sounds",
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <Card className="border-2 border-purple-400/20 bg-black/40 backdrop-blur-lg shadow-xl">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 2,
              }}
              className="mx-auto mb-4 bg-gradient-to-r from-purple-400 to-pink-500 p-3 rounded-full w-16 h-16 flex items-center justify-center"
            >
              <Music className="h-8 w-8 text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              {appTitle}
            </CardTitle>
            <CardDescription className="text-gray-300 mt-2">
              {appDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-gray-300">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5">
              <Keyboard className="h-5 w-5 text-purple-400" />
              <p>Press any key to create unique visual and audio effects</p>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5">
              <Settings className="h-5 w-5 text-purple-400" />
              <p>Customize animations and sounds in the settings panel</p>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5">
              <Info className="h-5 w-5 text-purple-400" />
              <p>Press ESC at any time to exit the application</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button
              onClick={onStart}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              Start Symphony
            </Button>
            <Button
              onClick={onShowInstructions}
              variant="outline"
              className="w-full border-purple-400/30 text-purple-300 hover:bg-purple-400/10"
            >
              View Instructions
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
