"use client";
import { useContext } from "react";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { AuthContext } from "../AuthContext";
import { toast } from "react-toastify";
export default function LogOut() {
  const router = useRouter();
  const { setIsAuthenticated } = useContext(AuthContext);
  const handleSignOut = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
      toast.success("Logout Successfully", {
        toastId: "uniqueToastLogout",
      });
    } catch (err) {
      console.log(err);
      toast.error("Error in Logout, try again later", {
        toastId: "uniqueToastLogout",
      });
    }
    router.push("/login");
  };
  handleSignOut();
  return null;
}
