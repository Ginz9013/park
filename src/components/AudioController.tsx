import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

type R1Pages = "ticket" | "roller" | "wheel" | "vote" | "cablecar" | null;
type R2Pages = "game" | "shop" | null;

interface AudioControllerProps<T extends R1Pages | R2Pages> {
  src: string;
  volume?: number;
  loop?: boolean;
  className?: string;
  positionStyle?: string;

  clickSoundSrc?: string;
  clickSoundVolume?: number;
  initialMuted?: boolean;
  pauseOtherMusic?: boolean; // 新增：是否暫停其他音樂
  activePage?: T; // 新增：當前頁面
  onPageChange?: React.Dispatch<
    React.SetStateAction<
      T
    >
  >; // 新增：頁面切換回調
  defaultMusic?: string; // 新增：預設音樂（當 activePage 為 null 時）
}

export default function AudioController<T extends R1Pages | R2Pages>({
  src,
  volume = 0.3,
  loop = true,
  className = "",
  positionStyle = "",

  clickSoundSrc,
  clickSoundVolume = 0.5,
  initialMuted = true,
  pauseOtherMusic = false,
  activePage,
  onPageChange,
  defaultMusic,
}: AudioControllerProps<T>) {
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [isMusicLoaded, setIsMusicLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const clickAudioRef = useRef<HTMLAudioElement>(null);

  // 暫停所有其他音樂
  const pauseAllOtherMusic = () => {
    const allAudioElements = document.querySelectorAll("audio");
    allAudioElements.forEach((audio) => {
      if (audio !== audioRef.current) {
        audio.pause();
      }
    });
  };

  // 根據頁面切換音效
  const switchMusicByPage = (
    page: R1Pages | R2Pages
  ) => {
    if (audioRef.current) {
      audioRef.current.pause();

      // 根據頁面設定不同的音效
      let newSrc = src; // 預設音效

      switch (page) {
        case "roller":
          newSrc = "./sound/landingpage_rollerpage_bgm.wav";
          break;
        case "wheel":
          newSrc = "./sound/wheel_bgm.wav";
          break;
        case "vote":
          newSrc = "./sound/map_bgm.wav";
          break;
        // R2
        case "shop":
          newSrc = "./sound/r2/shop_bgm.wav";
          break;
        case null:
        default:
          newSrc = defaultMusic || "./sound/map_bgm.wav";
          break;
      }

      // 更新音效來源
      audioRef.current.src = newSrc;
      audioRef.current.load();

      // 如果不是靜音狀態，開始播放新音效
      if (!isMuted) {
        audioRef.current.play().catch(console.error);
      }
    }
  };

  // 音效控制邏輯
  const handleMusicToggle = () => {
    if (audioRef.current) {
      if (isMuted) {
        if (pauseOtherMusic) {
          pauseAllOtherMusic();
        }
        audioRef.current.volume = volume;
        audioRef.current.play().catch(console.error);
        setIsMuted(false);
      } else {
        audioRef.current.pause();
        setIsMuted(true);
      }
    }
  };

  const handleMusicLoad = () => {
    setIsMusicLoaded(true);
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.loop = loop;
    }
  };

  // 當使用者第一次點擊時開始播放音樂
  const handleFirstInteraction = () => {
    if (audioRef.current && !isMuted && isMusicLoaded) {
      if (pauseOtherMusic) {
        pauseAllOtherMusic();
      }
      audioRef.current.play().catch(console.error);
    }
  };

  // 播放一次性音效
  const playClickSound = (onComplete?: () => void, customSrc?: string) => {
    const audioElement = customSrc
      ? (document.querySelector(
          `audio[src="${customSrc}"]`
        ) as HTMLAudioElement)
      : clickAudioRef.current;

    if (audioElement && !isMuted) {
      audioElement.volume = clickSoundVolume;
      audioElement.currentTime = 0; // 重置到開始

      // 監聽播放完成事件
      const handleEnded = () => {
        if (onComplete) {
          onComplete();
        }
        audioElement.removeEventListener("ended", handleEnded);
      };

      audioElement.addEventListener("ended", handleEnded);

      // 添加延遲確保音效播放
      setTimeout(() => {
        audioElement.play().catch(console.error);
      }, 100); // 100ms 延遲
    } else if (onComplete) {
      // 如果靜音，直接執行回調
      onComplete();
    }
  };

  // 監聽頁面變化並切換音效
  useEffect(() => {
    if (activePage !== undefined && onPageChange) {
      switchMusicByPage(activePage);
    }
  }, [activePage]);

  // 暴露給外部使用
  useEffect(() => {
    // 將 playClickSound 函數掛載到 window 上，讓其他組件可以使用
    (window as any).playClickSound = playClickSound;

    return () => {
      delete (window as any).playClickSound;
    };
  }, [isMuted, clickSoundVolume]);

  // 計算位置樣式

  return (
    <>
      {/* 背景音樂 */}
      <audio
        ref={audioRef}
        src={src}
        onLoadedData={handleMusicLoad}
        preload="auto"
      />

      {/* 一次性音效 */}
      {clickSoundSrc && (
        <audio ref={clickAudioRef} src={clickSoundSrc} preload="auto" />
      )}

      {/* 音量控制按鈕 */}
      <button
        onClick={() => {
          handleFirstInteraction();
          handleMusicToggle();
        }}
        className={`${positionStyle} bg-black/80 hover:bg-black/70 text-white p-3 rounded-xl transition-all duration-300 backdrop-blur-sm ${className}`}
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <VolumeX className="!size-5 md:!size-10" />
        ) : (
          <Volume2 className="!size-5 md:!size-10" />
        )}
      </button>
    </>
  );
}
