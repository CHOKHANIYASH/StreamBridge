"use client";
import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "/components/ui/input";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Loader from "react-js-loader";
import { signIn, getCurrentUser } from "aws-amplify/auth";
import { AuthContext } from "../AuthContext";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setIsAuthenticated } = useContext(AuthContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await signIn({
        username: email,
        password,
      });
      const user = await getCurrentUser();
      setLoading(false);
      setIsAuthenticated(true);
      router.push(`/dashboard/${user.userId}`);
    } catch (err) {
      console.log(err);
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

          {!loading ? (
            <button
              className="bg-gradient-to-br relative group/btn from-black  to-neutral-600 block d w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]"
              type="submit"
            >
              Sign in &rarr;
              <BottomGradient />
            </button>
          ) : (
            <Loader type="spinner-circle" bgColor={"#000000"} size={50} />
          )}
        </form>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 block w-full h-px transition duration-500 opacity-0 group-hover/btn:opacity-100 -bottom-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="absolute block w-1/2 h-px mx-auto transition duration-500 opacity-0 group-hover/btn:opacity-100 blur-sm -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
