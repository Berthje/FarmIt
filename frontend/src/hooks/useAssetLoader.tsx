import { useEffect, useState } from "react";
import { GAME_ASSETS } from "../assets/constants";

interface LoadingState {
  loaded: boolean;
  progress: number;
  errors: string[];
}

const useAssetLoader = () => {
  const [state, setState] = useState<LoadingState>({
    loaded: false,
    progress: 0,
    errors: [],
  });

  useEffect(() => {
    const loadImage = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve();
        img.onerror = () => reject(`Failed to load image: ${src}`);
      });
    };

    const loadAudio = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const audio = new Audio();
        audio.src = src;
        audio.oncanplaythrough = () => resolve();
        audio.onerror = () => reject(`Failed to load audio: ${src}`);
      });
    };

    const loadAllAssets = async () => {
      const imageFiles = Object.values(GAME_ASSETS.SPRITES)
        .flatMap((category) => Object.values(category))
        .flat();

      const audioFiles = Object.values(GAME_ASSETS.AUDIO)
        .flatMap((category) => Object.values(category))
        .flat();

      const totalAssets = imageFiles.length + audioFiles.length;
      let loadedCount = 0;
      const errors: string[] = [];

      const updateProgress = () => {
        loadedCount++;
        setState((prev) => ({
          ...prev,
          progress: (loadedCount / totalAssets) * 100,
        }));
      };

      // Load all assets in parallel
      await Promise.all([
        ...imageFiles.map((src) =>
          loadImage(src)
            .then(updateProgress)
            .catch((err) => errors.push(err))
        ),
        ...audioFiles.map((src) =>
          loadAudio(src)
            .then(updateProgress)
            .catch((err) => errors.push(err))
        ),
      ]);

      setState({
        loaded: errors.length === 0,
        progress: 100,
        errors,
      });
    };

    loadAllAssets();
  }, []);

  return state;
};

export default useAssetLoader;
