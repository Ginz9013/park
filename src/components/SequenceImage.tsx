import { useState, useEffect, useRef } from "react";

interface SequenceImageProps {
  basePath: string; // 圖片路徑前綴
  totalFrames: number; // 總幀數
  frameRate?: number; // 幀率（可選，預設30）
  className?: string; // 額外的 CSS 類名
  style?: React.CSSProperties; // 額外的樣式
  isPlaying?: boolean; // 是否播放（可選，預設true）
  preloadCount?: number; // 預載入的幀數
}

export const SequenceImage: React.FC<SequenceImageProps> = ({
  basePath,
  totalFrames,
  frameRate = 30,
  className = "",
  style = {},
  isPlaying = true,
  preloadCount = 10, // 預設預載入10幀
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [loadedFrames, setLoadedFrames] = useState<Set<number>>(new Set());
  const imageCache = useRef<Map<number, string>>(new Map());
  const frameRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);
  const frameInterval = 1000 / frameRate; // 計算每幀的時間間隔

  // 預載入圖片
  useEffect(() => {
    const preloadImages = async () => {
      const framesToLoad = new Set<number>();

      // 計算需要預載入的幀
      for (let i = 0; i < preloadCount; i++) {
        const frameIndex = (currentFrame + i) % totalFrames;
        framesToLoad.add(frameIndex);
      }

      // 載入圖片
      for (const frameIndex of framesToLoad) {
        if (!loadedFrames.has(frameIndex)) {
          const img = new Image();
          const framePath = `${basePath}${String(frameIndex).padStart(
            5,
            "0"
          )}.png`;

          try {
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              img.src = framePath;
            });

            imageCache.current.set(frameIndex, framePath);
            setLoadedFrames((prev) => new Set([...prev, frameIndex]));
          } catch (error) {
            console.error(`Failed to load frame ${frameIndex}:`, error);
          }
        }
      }
    };

    preloadImages();
  }, [currentFrame, basePath, totalFrames, preloadCount]);

  // 播放控制
  useEffect(() => {
    if (!isPlaying) return;

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }

      const elapsed = timestamp - lastTimeRef.current;

      // 檢查是否應該更新到下一幀
      if (elapsed > frameInterval) {
        setCurrentFrame((prevFrame) => (prevFrame + 1) % totalFrames);
        lastTimeRef.current = timestamp;
      }

      // 繼續動畫循環
      frameRef.current = requestAnimationFrame(animate);
    };

    // 開始動畫
    frameRef.current = requestAnimationFrame(animate);

    // 清理函數
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [totalFrames, frameRate, isPlaying]);

  return (
    <img
      src={
        imageCache.current.get(currentFrame) ||
        `${basePath}${String(currentFrame).padStart(5, "0")}.png`
      }
      className={`w-full h-full object-cover absolute top-0 left-0 ${className}`}
      style={{
        pointerEvents: "none",
        ...style,
      }}
    />
  );
};
