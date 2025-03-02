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
import axios from "axios";
export default function page() {
  const playerRef = useRef(null);
  const [video, setVideo] = React.useState("");
  const [resolution, setResolution] = React.useState("Auto");
  useEffect(() => {
    const videoId = window.location.pathname.split("/")[3];
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/video/${videoId}`)
      .then((res) => {
        setVideo(res.data.data.video);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error fetching video");
      });
  }, [resolution]);
  const videoJsOptions = {
    controls: true,
    fluid: true,
    responsive: true,
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
      <div className="flex flex-col items-center justify-center w-full h-screen font-semibold">
        <div className="flex flex-row justify-between w-full">
          <div className="mb-4 text-xl md:text-2xl text-blue">{video.name}</div>
          <div>
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
          </div>
        </div>
        <div className="w-3/4 overflow-hidden border-4 rounded-lg border-royalBlue">
          <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
        </div>
      </div>
    </>
  );
}
