import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "../services/api/authApi";
import useAuthStore from "../store/useAuthStore";
import Card from "../components/ui/Card";
import { useToast } from "../contexts/ToastContext";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuth } = useAuthStore();
  const { showToast } = useToast();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const handleCallback = async () => {
      const error = searchParams.get("error");
      const provider = searchParams.get("provider");
      const errorDetail = searchParams.get("error_detail");

      if (error) {
        console.error(`OAuth ${provider} error:`, errorDetail || error);
        showToast(errorDetail || "OAuth authentication failed", "error");
        navigate("/login", {
          replace: true,
          state: { error: errorDetail || "OAuth authentication failed" },
        });
        return;
      }

      setStatus("processing");

      try {
        // Backend set HTTP-only cookies on the redirect — fetch real user profile
        const user = await authApi.getMe();
        if (user?.id) {
          setAuth(user);
          showToast(`Logged in with ${provider || "OAuth"}`, "success");
          setStatus("success");
          setTimeout(() => navigate("/dashboard", { replace: true }), 800);
        } else {
          throw new Error("Invalid user data from OAuth callback");
        }
      } catch (err) {
        console.error("OAuth callback error:", err);
        showToast("Failed to complete OAuth authentication", "error");
        setStatus("error");
        setTimeout(
          () =>
            navigate("/login", {
              replace: true,
              state: { error: "Failed to complete OAuth authentication" },
            }),
          1500,
        );
      }
    };

    handleCallback();
  }, [searchParams, navigate, setAuth, showToast]);

  const getStatusMessage = () => {
    switch (status) {
      case "loading":
        return "Initializing OAuth flow...";
      case "processing":
        return "Processing authentication...";
      case "success":
        return "Authentication successful! Redirecting...";
      case "error":
        return "Authentication failed. Redirecting to login...";
      default:
        return "Completing authentication...";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "border-green-600";
      case "error":
        return "border-red-600";
      default:
        return "border-[#e85d26]";
    }
  };

  return (
    <div className="py-16">
      <div className="mx-auto max-w-lg px-4">
        <Card className="text-center">
          <div
            className={`mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 ${getStatusColor()}`}
          />
          <h2 className="font-display text-2xl font-bold text-slate-900">
            {status === "success" ? "Success" : "Authenticating"}
          </h2>
          <p className="mt-2 text-sm text-slate-600">{getStatusMessage()}</p>
          {status === "error" && (
            <p className="mt-3 text-xs text-rose-600">
              Authentication failed. Redirecting to login.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
