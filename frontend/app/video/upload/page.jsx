"use client";
import React, { useState, useContext } from "react";
import Loader from "react-js-loader";
import { FileUpload } from "@/components/ui/file-upload";
import axios from "axios";
import { AuthContext } from "@/app/AuthContext";
import { toast } from "react-toastify";
export default function Upload() {
  const [files, setFiles] = useState([]);
  const { userId } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const handleFileUpload = (newFiles) => {
    if (newFiles[0].type !== "video/mp4") {
      toast.error("Only mp4 files are allowed", {
        toastId: "uniqueToastUpload",
      });
      return;
    }
    toast.success("File added", { toastId: "uniqueToastLogin" });
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await Promise.all(
      files.map(async (file) => {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/video/upload`,
            {
              contentType: file.type,
              name: file.name,
              userId,
            }
          );
          const { url } = response.data.data;

          await axios.put(url, file, {
            headers: {
              "Content-Type": file.type, // Set the correct content type
            },
          });
          setLoading(false);
          toast.success(`File ${file.name} uploaded successfully!`);
        } catch (error) {
          console.error(`Error uploading file ${file.name}:`, error);
          toast.error(`Error uploading file ${file.name}`);
        }
      })
    );

    toast.info("All files processed!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col items-center justify-center min-h-screen max-md:p-4 ">
        <div className="w-full max-w-4xl mx-auto bg-white border-2 border-dashed rounded-lg min-h-96 border-royalBlue dark:bg-black dark:border-neutral-800">
          <FileUpload onChange={handleFileUpload} />
        </div>

        {!loading ? (
          <button
            type="submit"
            className="px-8 py-2 mt-4 text-xl text-white transition duration-200 transform border rounded-md border-neutral-300 bg-royalBlue hover:-translate-y-1 hover:shadow-md"
          >
            Upload Files
          </button>
        ) : (
          <Loader type="spinner-circle" bgColor={"#000000"} size={50} />
        )}
      </div>
    </form>
  );
}
