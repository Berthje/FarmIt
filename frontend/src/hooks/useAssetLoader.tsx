import { useEffect, useState } from "react";
import { GAME_ASSETS } from "../assets/constants";

interface LoadingState {
  loaded: boolean;
  progress: number;
  errors: string[];
  currentFile: string;
}

const useAssetLoader = () => {
  const [state, setState] = useState<LoadingState>({
    loaded: false,
    progress: 0,
    errors: [],
    currentFile: "",
  });

  useEffect(() => {
    const loadImage = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => {
          console.log(`Successfully loaded: ${src}`);
          resolve();
        };
        img.onerror = (e) => {
          console.error(`Failed to load image: ${src}`, e);
          reject(`Failed to load image: ${src}`);
        };
        img.src = src; // Set src after binding events
      });
    };

    const loadSvg = async (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        fetch(src)
          .then((response) => response.text())
          .then(() => resolve())
          .catch(reject);
      });
    };

    const loadAudio = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const audio = new window.Audio();
        audio.src = src;
        audio.oncanplaythrough = () => resolve();
        audio.onerror = () => reject(`Failed to load audio: ${src}`);
      });
    };

    const loadAllAssets = async () => {
      const allFiles = [
        ...Object.values(GAME_ASSETS.SPRITES).flatMap((category) =>
          Object.values(category)
        ),
        ...Object.values(GAME_ASSETS.AUDIO).flatMap((category) =>
          Object.values(category)
        ),
        ...Object.values(GAME_ASSETS.ICONS).flatMap((category) =>
          Object.values(category)
        ),
      ].flat();

      const totalFiles = allFiles.length;
      const errors: string[] = [];
      let loadedCount = 0;

      await Promise.all(
        allFiles.map(async (src) => {
          const filename = src.split("/").pop() || src;
          setState((prev) => ({
            ...prev,
            currentFile: filename,
          }));

          try {
            if (src.endsWith(".png")) {
              await loadImage(src);
            } else if (src.endsWith(".svg")) {
              await loadSvg(src);
            } else {
              await loadAudio(src);
            }
            loadedCount++;
            setState((prev) => ({
              ...prev,
              progress: (loadedCount / totalFiles) * 100,
            }));
          } catch (err) {
            errors.push(err as string);
          }
        }),
      );

      setState({
        loaded: errors.length === 0,
        progress: 100,
        errors,
        currentFile: "",
      });
    };

    loadAllAssets();
  }, []);

  return state;
};

export default useAssetLoader;
