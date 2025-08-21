import { useState } from "react";

const TestPage = () => {
  const [videos, setVideos] = useState<
    Array<{ id: number; src: string; title: string }>
  >([]);

  const videoFiles = [
    {
      src: "./elements/sample/file_example_WEBM_480_900KB.webm",
      title: "480p 900KB",
    },
    {
      src: "./elements/sample/file_example_WEBM_640_1_4MB.webm",
      title: "640p 1.4MB",
    },
    {
      src: "./elements/sample/file_example_WEBM_1280_3_6MB.webm",
      title: "1280p 3.6MB",
    },
    {
      src: "./elements/250612_map_bg/output.webm",
      title: "樂園背景 3.6MB",
    },
  ];

  const addVideo = (videoFile: { src: string; title: string }) => {
    const newVideo = {
      id: Date.now(),
      src: videoFile.src,
      title: videoFile.title,
    };
    setVideos((prev) => [...prev, newVideo]);
  };

  // const removeVideo = (id: number) => {
  //   setVideos((prev) => prev.filter((video) => video.id !== id));
  // };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="relative z-10">
        <h1 className="text-3xl font-bold mb-8">影片疊加測試頁面</h1>

        {/* 控制按鈕 */}
        <div className="mb-8 space-y-4">
          <h2 className="text-xl font-semibold">新增影片(WEBM)</h2>
          <div className="flex gap-4 flex-wrap">
            {videoFiles.map((videoFile, index) => (
              <button
                key={index}
                onClick={() => addVideo(videoFile)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                新增 {videoFile.title}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <button
              onClick={() => setVideos([])}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
            >
              清除所有影片
            </button>
          </div>

          <div className="text-lg">目前播放中: {videos.length} 個影片</div>
        </div>
      </div>

      {/* 影片疊加區域 */}
      <div className="absolute inset-0 w-full  bg-gray-900 rounded-lg overflow-hidden -z-0">
        {videos.map((video, index) => (
          <div
            key={video.id}
            className="absolute top-0 left-0 scale-70"
            style={{
              zIndex: index + 1,
              transform: `translate(${index * 20}px, ${index * 20}px)`,
            }}
          >
            <video
              src={video.src}
              autoPlay
              loop
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded text-sm">
              {video.title} (ID: {video.id})
            </div>
          </div>
        ))}

        {videos.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            點擊上方按鈕新增影片進行測試
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPage;
