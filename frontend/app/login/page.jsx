"use client";
import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/utils/SubmitButton";
import LabelInputContainer from "@/components/utils/LabelInputContainer";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { signIn, getCurrentUser } from "aws-amplify/auth";
import { AuthContext } from "../AuthContext";
import { toast } from "react-toastify";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setIsAuthenticated, setUserId } = useContext(AuthContext);
  const testEmail = process.env.NEXT_PUBLIC_TEST_EMAIL;
  const testPassword = process.env.NEXT_PUBLIC_TEST_PASSWORD;
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await signIn({
        username: email,
        password,
      });
      const user = await getCurrentUser();
      setIsAuthenticated(true);
      setUserId(user.userId);
      toast.success("Login Successful", {
        toastId: "uniqueToastLogin",
      });
      router.push(`/dashboard/${user.userId}`);
    } catch (err) {
      console.log(err);
      toast.error(err.message, {
        toastId: "uniqueToastLogin",
      });
    } finally {
      setLoading(false);
    }
    console.log("Form submitted");
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen md:flex-row bg-neutral-100 dark:bg-black max-md:m-10 max-md:mt-0">
      <div className="w-1/2 h-screen max-md:hidden">
        <Image
          src="/Login.jpg"
          // layout="responsive" // Makes the image take full width
          width={1080} // Set the aspect ratio
          height={1080} // Set the aspect ratio
          alt="Stream Bridge logo"
          className="w-full h-full" // Additional classes for responsiveness
        />
      </div>

      <div className="w-full max-w-md p-4 mx-auto bg-white rounded-none md:rounded-2xl md:p-8 shadow-input dark:bg-black">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
          Login
        </h2>
        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="projectmayhem@fc.com"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </LabelInputContainer>

          <SubmitButton loading={loading} label="Sign in" />

          <button
            className="p-[3px] relative mt-2"
            onClick={() => {
              setEmail(testEmail);
              setPassword(testPassword);
            }}
            type="submit"
          >
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500" />
            <div className="px-6 py-1  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
              Test User
            </div>
          </button>
        </form>
      </div>
    </div>
  );
}
