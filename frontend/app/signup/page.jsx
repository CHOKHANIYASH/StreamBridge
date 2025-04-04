"use client";
import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "/components/ui/input";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Loader from "react-js-loader";
import axios from "axios";
import { signUp, confirmSignUp, autoSignIn } from "aws-amplify/auth";
import { AuthContext } from "../AuthContext";
import { toast } from "react-toastify";
export default function Signup() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { userId, setIsAuthenticated, setUserId } = useContext(AuthContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
          autoSignIn: true,
        },
      });
      setUserId(userId);
      setSignupConfirm(true);
      setLoading(false);
      toast.info("Verification Code has been send to your emailid", {
        toastId: "uniqueToastSignup",
      });
      console.log("Form submitted");
    } catch (err) {
      // console.log(err.message);
      toast.error(err.message, {
        toastId: "uniqueToastSignup",
      });
      setLoading(false);
    }
  };
  const handleConfirmSignUp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username: email,
        confirmationCode: code,
      });
      await saveUser();
      setLoading(false);
    } catch (err) {
      toast.error(err.message, {
        toastId: "uniqueToastSignup",
      });
      // console.log(err);
      setLoading(false);
    }
  };
  const saveUser = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/user/signup`, {
        firstName,
        lastName,
        email,
        userId,
      });

      setIsAuthenticated(true);
      setUserId(userId);
      await autoSignIn();

      toast.success("User Registered Successfully", {
        toastId: "uniqueToastSignup",
      });

      router.push(`/dashboard/${userId}`);
    } catch (err) {
      console.error("Error during signup:", err);
      toast.error("Signup failed. Please try again.", {
        toastId: "uniqueToastSignup",
      });
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen md:flex-row bg-neutral-100 dark:bg-black max-md:m-10 max-md:mt-0">
      <div className="w-1/2 h-screen max-md:hidden">
        <Image
          src="/Signup.jpg"
          width={1080} // Set the aspect ratio
          height={1080} // Set the aspect ratio
          alt="Stream Bridge logo"
          className="w-full h-full" // Additional classes for responsiveness
        />
      </div>

      <div className="w-full max-w-md p-4 mx-auto bg-white rounded-none md:rounded-2xl md:p-8 shadow-input dark:bg-black">
        {!signupConfirm ? (
          <>
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
              Welcome to Stream Bridge
            </h2>
            <form className="my-8" onSubmit={handleSubmit}>
              <div className="flex flex-col mb-4 space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                <LabelInputContainer>
                  <Label htmlFor="firstname">First name</Label>
                  <Input
                    id="firstname"
                    placeholder="Tyler"
                    type="text"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="lastname">Last name</Label>
                  <Input
                    id="lastname"
                    placeholder="Durden"
                    type="text"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </LabelInputContainer>
              </div>
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
                  Sign up &rarr;
                  <BottomGradient />
                </button>
              ) : (
                <Loader type="spinner-circle" bgColor={"#000000"} size={50} />
              )}
            </form>
          </>
        ) : (
          <>
            <form on onSubmit={handleConfirmSignUp}>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="Signup-Code">Signup Code</Label>
                <Input
                  value={code}
                  id="Signup-Code"
                  placeholder="••••••••"
                  type="number"
                  onChange={(e) => setCode(e.target.value)}
                />
              </LabelInputContainer>
              {!loading ? (
                <button
                  className="bg-gradient-to-br relative group/btn from-black  to-neutral-600 block d w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]"
                  type="submit"
                >
                  Confirm Sign up &rarr;
                  <BottomGradient />
                </button>
              ) : (
                <Loader type="spinner-circle" bgColor={"#000000"} size={50} />
              )}
            </form>
          </>
        )}
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
