import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Always reachable, even during maintenance — otherwise staff who get logged
// out (or open a fresh tab) have no way back in to turn maintenance off.
const ALWAYS_ALLOWED_PATHS = ["/login", "/forgot-password"];

export default function MaintenanceGate({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [maintenance, setMaintenance] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const check = () =>
      fetch(`${API_URL}/system/maintenance-status`)
        .then((res) => res.json())
        .then((data) => setMaintenance(!!data?.enabled))
        .catch(() => setMaintenance(false))
        .finally(() => setChecked(true));

    check();
    // Poll so an already-open tab picks up a toggle without needing a manual reload.
    const interval = setInterval(check, 15000);
    return () => clearInterval(interval);
  }, []);

  const isStaff = user?.role === "admin" || user?.role === "super_admin";
  const isAlwaysAllowed = ALWAYS_ALLOWED_PATHS.includes(window.location.pathname);

  if (!checked || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f4f0]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex h-14 w-14 items-center justify-center">
            <div className="absolute inset-0 rounded-2xl border-4 border-[rgba(232,93,38,0.15)] border-t-[#e85d26] animate-spin" />
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#e85d26] to-[#2563eb] font-bold text-white text-sm">
              B
            </div>
          </div>
          <p className="text-sm text-[#a09880] italic">Building your knowledge universe...</p>
        </div>
      </div>
    );
  }

  if (maintenance && !isStaff && !isAlwaysAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 text-center bg-[#f5f4f0]">
        <div className="max-w-md">
          <div className="text-5xl mb-4">🔧</div>
          <h1 className="font-display text-2xl font-bold text-[#1a1814] mb-2">
            BlogByte is down for maintenance
          </h1>
          <p className="text-sm text-[#6b6358]">
            We're making some improvements and will be back shortly. Thanks for your patience.
          </p>
        </div>
      </div>
    );
  }

  if (maintenance && isStaff) {
    return (
      <>
        <div className="bg-amber-500 text-white text-xs font-semibold text-center py-1.5 px-4 sticky top-0 z-[100]">
          🔧 Maintenance mode is ON — regular users are seeing the maintenance page. You can browse normally as staff.
        </div>
        {children}
      </>
    );
  }

  return children;
}
