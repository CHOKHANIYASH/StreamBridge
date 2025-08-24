"use client";
import React, { useState, useContext } from "react";
import Loader from "react-js-loader";
import { FileUpload } from "@/components/ui/file-upload";
import axios from "axios";
import { AuthContext } from "@/app/AuthContext";
import axiosRequest from "@/lib/axiosRequest";
import { toast } from "react-toastify";
import ProtectedRoute from "@/app/ProtectedRoute";
function Upload() {
  const [file, setFile] = useState(null);
  const { userId, getAccessToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const handleFileUpload = (newFiles) => {
    if (newFiles[0].type !== "video/mp4") {
      toast.error("Only mp4 files are allowed", {
        toastId: "uniqueToastUpload",
      });
      return;
    }
    setFile(newFiles[0]);
    toast.success("File added", { toastId: "uniqueToastLogin" });
  };
  const getUploadUrl = async () => {
    const accessToken = await getAccessToken();
    const { data } = await axiosRequest({
      url: `/videos`,
      method: "post",
      auth: true,
      accessToken,
      errorMessage: `Error uploading file ${file.name}:`,
      data: {
        contentType: file.type,
        name: file.name.substring(0, file.name.length - 4),
      },
    }).catch((e) => {
      setLoading(false);
    });
    return data.url;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmit(true);
    const url = await getUploadUrl();
    console.log("upload url = " + url);
    await axios.put(url, file, {
      headers: {
        "Content-Type": file.type, // Set the correct content type
      },
    });
    setLoading(false);
    setFile(null);
    setSubmit(false);
    toast.success(`File ${file.name} uploaded successfully!`);
    toast.success(`You will recieve an email once the video is processed!`, {
      autoClose: false,
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center justify-center min-h-screen max-md:p-4 ">
          <div className="w-full max-w-4xl mx-auto bg-white border-2 border-dashed rounded-lg min-h-96 border-royalBlue dark:bg-black dark:border-neutral-800">
            <FileUpload onChange={handleFileUpload} submit={submit} />
          </div>

          <SubmitButton loading={loading} />
        </div>
      </form>
    </>
  );
}

export default ProtectedRoute(Upload);

const SubmitButton = ({ loading }) => {
  return (
    <>
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
    </>
  );
};
