import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function OAuthComplete() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { clerkSocialLogin } = useAuth();

  useEffect(() => {
    if (!user) return;

    const sendToBackend = async () => {
      try {
        const email = user.primaryEmailAddress?.emailAddress;
        const name = user.fullName;
        const clerkUserId = user.id;

        const provider =
          user?.externalAccounts?.[0]?.provider || "google";

        const res = await clerkSocialLogin({
          clerkUserId,
          email,
          name,
          provider
        });

        if (res?.success) {
          navigate("/", { replace: true });
        } else {
          alert(res.message);
        }
      } catch (e) {
        alert("Social login error");
      }
    };

    sendToBackend();
  }, [user]);

  return <div>Finishing Login...</div>;
}
