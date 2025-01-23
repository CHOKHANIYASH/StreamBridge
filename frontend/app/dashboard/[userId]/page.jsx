"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AuthContext } from "@/app/AuthContext";
import { toast } from "react-toastify";
import ProtectedRoute from "@/app/ProtectedRoute";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
function Dashboard() {
  const router = useRouter();
  const { userId } = React.useContext(AuthContext);
  const [videos, setVideos] = useState([]);
  useEffect(() => {
    if (userId == "") return;
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL}/video/user/${userId}`)
      .then((res) => {
        setVideos(res.data.data.videos);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error fetching videos");
      });
  }, [userId]);
  // const router = useRouter();
  const [name, setName] = useState("");
  const handleDelete = async (videoId) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/video/delete/${videoId}`
      );
      setVideos(videos.filter((video) => video.id !== videoId));
      toast.success("Video deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error deleting video");
    }
  };
  const copyTextToClipboard = async (text) => {
    if ("clipboard" in navigator) {
      await navigator.clipboard.writeText(text);
      toast.success("Url copied", {
        toastId: "uniqueToastDocs",
      });
    }
  };
  return (
    <>
      <h1 className="mx-2 text-2xl font-semibold text-deepCharcoal">
        Dashboard
      </h1>
      <h1 className="mx-2 text-2xl font-semibold text-deepCharcoal">{name}</h1>

      <div className="flex items-center justify-between h-screen">
        <div className="w-3/4 mx-auto bg-white border-2 border-gray-200 rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Created at</TableHead>
                <TableHead>HLS Url</TableHead>
                <TableHead>Share url</TableHead>
                <TableHead className="text-right">Watch</TableHead>
                <TableHead className="text-right">Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos &&
                videos.map((video) => (
                  <TableRow key={video.id}>
                    <TableCell className="font-medium">{video.name}</TableCell>
                    <TableCell>{video.username}</TableCell>
                    <TableCell>{video.createdAt}</TableCell>
                    <TableCell>
                      <div>
                        <DropdownMenu className="">
                          <DropdownMenuTrigger className="p-1 mr-2 text-sm text-white transition duration-200 transform border rounded-md border-neutral-300 bg-royalBlue hover:-translate-y-1 hover:shadow-md">
                            Copy Url
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() =>
                                copyTextToClipboard(
                                  `${video.url}/1080p/index.m3u8`
                                )
                              }
                            >
                              1080p
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                copyTextToClipboard(
                                  `${video.url}/720p/index.m3u8`
                                )
                              }
                            >
                              720p
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                copyTextToClipboard(
                                  `${video.url}/480p/index.m3u8`
                                )
                              }
                            >
                              480p
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                copyTextToClipboard(
                                  `${video.url}/360p/index.m3u8`
                                )
                              }
                            >
                              360p
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                    <TableCell>
                      <button
                        className="p-1 mt-2 text-white transition duration-200 transform border rounded-md text-md border-neutral-300 bg-royalBlue hover:-translate-y-1 hover:shadow-md"
                        onClick={() => {
                          console.log("play");
                          copyTextToClipboard(
                            `${window.location.origin}/video/play/${video.id}`
                          );
                        }}
                      >
                        Share
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        type="submit"
                        className="px-2 py-2 mt-4 text-white transition duration-200 transform border rounded-md text-md border-neutral-300 bg-royalBlue hover:-translate-y-1 hover:shadow-md"
                        onClick={() => {
                          console.log("play");
                          router.push(`/video/play/${video.id}`);
                        }}
                      >
                        Play
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        type="submit"
                        className="px-2 py-2 mt-4 text-white transition duration-200 transform bg-red-400 border rounded-md text-md border-neutral-300 hover:-translate-y-1 hover:shadow-md"
                        onClick={() => handleDelete(video.id)}
                      >
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
export default ProtectedRoute(Dashboard);
