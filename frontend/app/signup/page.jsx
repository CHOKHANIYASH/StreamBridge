"use client";
import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../AuthContext";
import Image from "next/image";
import SignupForm from "@/components/auth/SignupForm";
import ConfirmSignupForm from "@/components/auth/ConfirmSignupForm";
import axios from "axios";
import { autoSignIn } from "aws-amplify/auth";
import { toast } from "react-toastify";
export default function Signup() {
  const router = useRouter();

  const [signupConfirm, setSignupConfirm] = useState(false);
  const [user, setUser] = useState(null);
  const { setIsAuthenticated, setUserId } = useContext(AuthContext);

  function onSignupSuccess(user) {
    setUser(user);
    setUserId(user.id);
    setSignupConfirm(true);
  }

  async function onConfirmation() {
    await saveUser(user);

    // router.push(`/dashboard/${user.id}`);
    router.push("/login");
  }

  const saveUser = async (user) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/register`, {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });

      // await autoSignIn();

      setIsAuthenticated(true);

      toast.success("User Registered Successfully", {
        toastId: "uniqueToastSignup",
      });
    } catch (err) {
      console.error("Error during signup:", err);
      toast.error("Signup failed. Please try again.", {
        toastId: "uniqueToastSignup",
      });
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
            <SignupForm onSignupSuccess={onSignupSuccess} />
          </>
        ) : (
          <>
            <ConfirmSignupForm user={user} onConfirmation={onConfirmation} />
          </>
        )}
      </div>
    </div>
  );
}
