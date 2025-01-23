"use client";
import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "./AuthContext";
import { getCurrentUser } from "aws-amplify/auth";

import { toast } from "react-toastify";

export default function ProtectedRoute(Component) {
  return function ProtectedRouteWrapper(props) {
    const router = useRouter();
    const { isAuthenticated } = useContext(AuthContext);

    useEffect(() => {
      getCurrentUser()
        .then((user) => {
          //   console.log(user);
        })
        .catch((err) => {
          toast.error("Please log in first", {
            toastId: "uniqueToastProtected",
          });
          router.push("/login");
        });
    }, [isAuthenticated]);
    return <Component {...props} />;
  };
}
