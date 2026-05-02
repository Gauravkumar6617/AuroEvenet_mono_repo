import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiClient } from "../services/api";
import useAuthStore from "../store/useAuthStore";
import Card from "../components/ui/Card";
import { useToast } from "../contexts/ToastContext";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const setAuth = useAuthStore((state) => state.setAuth);
  const setError = useAuthStore((state) => state.setError);
  const { showToast } = useToast();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const error = searchParams.get("error");
        const provider = searchParams.get("provider");
        console.info("[OAuth] Callback page loaded", {
          href: window.location.href,
          provider,
          error,
          params: Object.fromEntries(searchParams.entries()),
        });

        if (error) {
          const errorDetail = searchParams.get("error_detail");
          console.error("OAuth error:", {
            error,
            provider,
            errorDetail,
            href: window.location.href,
          });
          setError(errorDetail || error);
          showToast(errorDetail || "OAuth authentication failed", "error");
          navigate("/login?error=oauth_failed");
          return;
        }

        setStatus("processing");

        // Since OAuth uses HttpOnly cookies, we need to verify authentication by calling /me endpoint
        try {
          console.info("[OAuth] Fetching authenticated user via /me");
          const response = await apiClient.getMe();

          if (response) {
            console.info("[OAuth] /me returned user", {
              id: response.id,
              email: response.email,
              username: response.username,
              oauth_provider: response.oauth_provider,
            });
            // Store the user data from OAuth response
            const user = {
              id: response.id || 0,
              email: response.email || "",
              username:
                response.username || response.email?.split("@")[0] || "",
              is_active: response.is_active || true,
              is_verified: response.is_verified || true,
              created_at: response.created_at || new Date().toISOString(),
              updated_at: response.updated_at || new Date().toISOString(),
              oauth_provider: response.oauth_provider || provider || "unknown",
              oauth_id: response.oauth_id || "",
            };

            localStorage.setItem("user", JSON.stringify(user));
            console.info("[OAuth] Writing auth user into store", {
              id: user.id,
              email: user.email,
              provider: user.oauth_provider,
            });
            setAuth(user);
            showToast(`Logged in with ${provider || "OAuth"}`, "success");
            console.info("[OAuth] Auth store updated successfully");
            setStatus("success");

            // Redirect to dashboard or home
            setTimeout(() => {
              console.info(
                "[OAuth] Redirecting authenticated user to dashboard",
              );
              navigate("/dashboard");
            }, 1000);
          } else {
            throw new Error("Failed to get user information");
          }
        } catch (apiError) {
          console.error("Failed to get user info:", {
            provider,
            error: apiError,
            href: window.location.href,
          });
          throw new Error(
            "Authentication failed - could not retrieve user information",
          );
        }
      } catch (error) {
        console.error("OAuth callback error:", {
          provider: searchParams.get("provider"),
          error,
          href: window.location.href,
        });
        setError(error?.message || "OAuth authentication failed");
        showToast(error?.message || "OAuth callback failed", "error");
        setStatus("error");

        setTimeout(() => {
          navigate("/login?error=oauth_callback_failed");
        }, 2000);
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, setAuth, setError, showToast]);

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
        return "border-indigo-600";
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
