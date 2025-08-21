import { useEffect, useRef, useState } from "react";

interface SequenceCanvasProps {
  basePath: string;
  totalFrames: number;
  frameRate?: number;
  className?: string;
  style?: React.CSSProperties;
  isPlaying?: boolean;
}

export const SequenceCanvas: React.FC<SequenceCanvasProps> = ({
  basePath,
  totalFrames,
  frameRate = 30,
  className = "",
  style = {},
  isPlaying = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const frameRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);
  const frameInterval = 1000 / frameRate;

  // 預載入圖片
  useEffect(() => {
    const loadImages = async () => {
      console.log("開始載入圖片...");
      const loadedImages: HTMLImageElement[] = [];

      for (let i = 0; i < totalFrames; i++) {
        const img = new Image();
        const framePath = `${basePath}${String(i).padStart(5, "0")}.png`;
        // console.log(`載入圖片: ${framePath}`);

        try {
          await new Promise((resolve, reject) => {
            img.onload = () => {
              // console.log(`圖片載入成功: ${framePath}`);
              resolve(true);
            };
            img.onerror = (error) => {
              // console.error(`圖片載入失敗: ${framePath}`, error);
              reject(error);
            };
            img.src = framePath;
          });
          loadedImages.push(img);
        } catch (error) {
          console.error(`載入圖片失敗: ${framePath}`, error);
        }
      }

      console.log(`總共載入 ${loadedImages.length} 張圖片`);
      setImages(loadedImages);
    };

    loadImages();
  }, [basePath, totalFrames]);

  // 繪製動畫
  useEffect(() => {
    if (!isPlaying || images.length === 0) {
      console.log("動畫未開始：", { isPlaying, imagesLength: images.length });
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      console.log("找不到 canvas 元素");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.log("無法獲取 canvas context");
      return;
    }

    console.log("開始動畫...");

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }

      const elapsed = timestamp - lastTimeRef.current;

      if (elapsed > frameInterval) {
        // 清除畫布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 繪製當前幀
        const currentImage = images[currentFrameRef.current];
        if (currentImage) {
          ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
          // console.log(`繪製第 ${currentFrameRef.current} 幀`);
        } else {
          console.log(`找不到第 ${currentFrameRef.current} 幀的圖片`);
        }

        // 更新幀
        currentFrameRef.current = (currentFrameRef.current + 1) % totalFrames;
        lastTimeRef.current = timestamp;
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [images, totalFrames, frameRate, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute top-0 left-0 ${className}`}
      style={{
        pointerEvents: "none",
        ...style,
      }}
      width={style.width as number}
      height={style.height as number}
    />
  );
};
