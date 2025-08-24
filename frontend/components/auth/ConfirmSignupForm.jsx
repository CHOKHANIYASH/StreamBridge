import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "/components/ui/input";
import { cn } from "@/lib/utils";
import SubmitButton from "@/components/utils/SubmitButton";
import LabelInputContainer from "../utils/LabelInputContainer";
import { toast } from "react-toastify";
import { confirmSignUp } from "aws-amplify/auth";
export default function ConfirmSignupForm({ user, onConfirmation }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirmSignUp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await confirmSignUp({
        username: user.email,
        confirmationCode: code,
      });
      onConfirmation();
    } catch (err) {
      toast.error(err.message, {
        toastId: "uniqueToastSignup",
      });
      // console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleConfirmSignUp}>
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
        <SubmitButton loading={loading} label="Confirm Sign up" />
      </form>
    </>
  );
}
