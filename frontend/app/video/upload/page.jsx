"use client";
import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { BackgroundGradient } from "@/components/ui/background-gradient";

export default function Upload() {
  const [files, setFiles] = useState([]);
  const handleFileUpload = (files) => {
    setFiles(files);
    console.log(files);
  };

  return (
    <div className="flex items-center justify-center min-h-screen  ">
      <div className=" w-full max-w-4xl mx-auto my-auto min-h-96 border-2 border-dashed border-royalBlue bg-white dark:bg-black   dark:border-neutral-800 rounded-lg">
        <FileUpload onChange={handleFileUpload} />
      </div>
    </div>
  );
}
