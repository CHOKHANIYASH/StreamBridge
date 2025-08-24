import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "/components/ui/input";
import SubmitButton from "@/components/utils/SubmitButton";
import LabelInputContainer from "../utils/LabelInputContainer";
import { toast } from "react-toastify";
import { signUp } from "aws-amplify/auth";

export default function SignupForm({ onSignupSuccess }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { userId } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
          autoSignIn: true,
        },
      });
      onSignupSuccess({ id: userId, email, firstName, lastName });
      toast.info("Verification Code has been send to your emailid", {
        toastId: "uniqueToastSignup",
      });
    } catch (err) {
      // console.log(err.message);
      toast.error(err.message, {
        toastId: "uniqueToastSignup",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
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

        <SubmitButton loading={loading} label="Sign Up" />
      </form>
    </>
  );
}
