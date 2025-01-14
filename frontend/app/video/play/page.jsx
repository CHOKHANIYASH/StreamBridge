"use client";
import React from "react";
import VideoJS from "./videoPlayer";
import { useRef } from "react";

export default function page() {
  const playerRef = useRef(null);
  const videoLink =
    "https://d366npge5i4pim.cloudfront.net/ShangChiTrim.mp4/1080p/index.m3u8";
  // const videoLink = "";
  const videoJsOptions = {
    controls: true,
    fluid: true,
    responsive: true,
    sources: [
      {
        src: videoLink,
        type: "application/x-mpegURL",
      },
    ],
  };
  const handlePlayerReady = (player) => {
    playerRef.current = player;
    player.on("ended", () => {
      console.log("ended");
    });
  };

  return (
    <>
      <div className="w-full h-screen flex flex-col items-center justify-center font-semibold">
        <div className="text-blue text-4xl mb-4">Shang Chi</div>
        <div className="w-3/4 border-4 border-royalBlue rounded-lg overflow-hidden">
          <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
        </div>
      </div>
    </>
  );
}
