"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import VideoJS from "./videoPlayer";
import { useState, useRef, useEffect } from "react";
import axiosRequest from "@/lib/axiosRequest";
import { setRequestMeta } from "next/dist/server/request-meta";

export default function page() {
  const playerRef = useRef(null);
  const [video, setVideo] = useState("");
  const [resolution, setResolution] = useState("Auto");

  useEffect(() => {
    const fetchVideoData = async () => {
      const videoId = window.location.pathname.split("/")[3];
      const { data } = await axiosRequest({
        url: `/videos/${videoId}`,
        errorMessage: "Error loading video",
      });
      setVideo(data);
    };
    fetchVideoData();
  }, []);

  const videoJsOptions = {
    controls: true,
    fluid: true,
    responsive: true,
    preload: "auto",
    aspectRatio: "16:9",
    // audioPosterMode: true, // use when using thumbnail
    playbackRates: [0.5, 1, 1.5, 2],
    controlBar: {
      skipButtons: {
        forward: 5,
        backward: 5,
      },
    },
    userActions: {
      hotkeys: function (event) {
        switch (event.key) {
          case " ": // Spacebar = toggle play/pause
            event.preventDefault(); // stop page from scrolling
            if (this.paused()) {
              this.play();
            } else {
              this.pause();
            }
            break;

          case "x": // Force pause
            this.pause();
            break;

          case "y": // Force play
            this.play();
            break;

          case "ArrowRight": // Forward 5 seconds
            event.preventDefault();
            this.currentTime(this.currentTime() + 5);
            break;

          case "ArrowLeft": // Backward 5 seconds
            event.preventDefault();
            this.currentTime(this.currentTime() - 5);
            break;
          case "f": // Fullscreen (Ctrl+F)
            if (event.ctrlKey) {
              event.preventDefault();
              if (this.isFullscreen()) {
                this.exitFullscreen();
              } else {
                this.requestFullscreen();
              }
            }
            break;
        }
      },
    },
    sources: [
      {
        src:
          resolution === "Auto"
            ? video.url + `/master.m3u8`
            : video.url + `/${resolution}/index.m3u8`,
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
      <div className="flex flex-col items-center justify-center w-full font-semibold md:h-screen ">
        <div className="w-3/4 mb-2 text-end ">
          <ResolutionButton
            setResolution={setResolution}
            resolution={resolution}
          />
        </div>
        <div className="w-3/4 overflow-hidden border-4 rounded-lg border-royalBlue">
          {video ? (
            <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
          ) : null}
        </div>
        <div className="flex flex-col justify-between w-3/4 mb-2 ">
          <div className="text-xl text-black md:text-2xl ">{video.name}</div>
          <div className="text-sm text-gray-400 md:text-md ">
            {video.createdAt}
          </div>
          <div className="text-sm text-gray-400 md:text-md ">
            Posted By - {video.username}
          </div>
        </div>
      </div>
    </>
  );
}

const ResolutionButton = ({ setResolution, resolution }) => {
  return (
    <>
      <DropdownMenu className="">
        <DropdownMenuTrigger className="p-2 mr-2 text-sm text-white transition duration-200 transform border rounded-md border-neutral-300 bg-royalBlue hover:-translate-y-1 hover:shadow-md">
          {resolution}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setResolution("Auto")}>
            Auto
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setResolution("1080p")}>
            1080p
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setResolution("720p")}>
            720p
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setResolution("480p")}>
            480p
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setResolution("360p")}>
            360p
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
