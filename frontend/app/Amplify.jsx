"use client";
import React from "react";
import { Amplify } from "aws-amplify";

// import outputs from "@/amplify_outputs.json";
import outputs from "@/src/aws-exports";
// console.log("outputs = ", outputs);
Amplify.configure({ ...outputs, ssr: true });

export default function AmplifyConfig() {
  return null;
}
