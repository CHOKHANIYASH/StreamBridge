"use client";
import { useContext } from "react";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { AuthContext } from "../AuthContext";

export default function LogOut() {
  const router = useRouter();
  const { setIsAuthenticated } = useContext(AuthContext);
  const handleSignOut = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
    } catch (err) {
      console.log(err);
    }
    router.push("/login");
  };
  handleSignOut();
  return null;
}
