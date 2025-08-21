import { volumeStore$, toggleMute } from "@/store/volume";
import { useEffect, useRef, useState } from "react";

export const useVolume = () => {
  
  const [isMute, setIsMute] = useState<boolean>(volumeStore$.value);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const subscription = volumeStore$.subscribe(setIsMute);

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!audioRef) return;

    if (isMute) audioRef.current?.pause();
    else audioRef.current?.play();
  }, [isMute]);

  return { isMute, toggleMute, audioRef };
}