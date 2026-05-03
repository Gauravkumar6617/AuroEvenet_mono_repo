import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import usePersonalizationStore from "../store/usePersonalizationStore";
import PersonalizationWizardModal from "../components/personalization/PersonalizationWizardModal";
import SubscribePopup from "../components/personalization/SubscribePopup";

const SESSION_LATER_KEY = "aura_prefs_later";

const PersonalizationContext = createContext(null);

export function usePersonalization() {
  const ctx = useContext(PersonalizationContext);
  if (!ctx) {
    throw new Error("usePersonalization must be used within PersonalizationProvider");
  }
  return ctx;
}

export function PersonalizationProvider({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [subscribeOpen, setSubscribeOpen] = useState(false);

  const onboardingClosed = usePersonalizationStore((s) => s.onboardingClosed);
  const tasteDisabled = usePersonalizationStore((s) => s.tasteDisabled);

  const authPrefixes = [
    "/login",
    "/signup",
    "/verify-otp",
    "/forgot-password",
    "/oauth/callback",
  ];
  const hideChrome = authPrefixes.some(
    (p) =>
      location.pathname === p ||
      location.pathname.startsWith(`${p}/`),
  );

  const openTuneModal = useCallback(() => {
    setWizardOpen(true);
  }, []);

  useEffect(() => {
    setSubscribeOpen(false);
  }, [location.pathname]);

  /** Auto-open taste wizard shortly after landing (guests + signed-in), if onboarding not done. */
  useEffect(() => {
    if (loading || hideChrome || tasteDisabled) return;
    if (onboardingClosed) return;
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(SESSION_LATER_KEY) === "1") {
      return;
    }
    const showMs = 600;
    const t = window.setTimeout(() => setWizardOpen(true), showMs);
    return () => window.clearTimeout(t);
  }, [loading, hideChrome, tasteDisabled, onboardingClosed, isAuthenticated]);

  const prevWizardOpen = useRef(wizardOpen);
  useEffect(() => {
    const justClosedWizard = prevWizardOpen.current && !wizardOpen;
    prevWizardOpen.current = wizardOpen;

    if (hideChrome || wizardOpen) return;

    const subOk = usePersonalizationStore.getState().subscribeVisible();
    if (!subOk) return;

    /** A few seconds after the page is ready; shorter gap right after closing the wizard. */
    const delayMs = justClosedWizard ? 3200 : 4200;
    const t = window.setTimeout(() => setSubscribeOpen(true), delayMs);
    return () => window.clearTimeout(t);
  }, [hideChrome, wizardOpen, location.pathname]);

  const closeWizard = useCallback(() => setWizardOpen(false), []);

  return (
    <PersonalizationContext.Provider value={{ openTuneModal }}>
      {children}
      {wizardOpen ? (
        <PersonalizationWizardModal open={wizardOpen} onClose={closeWizard} />
      ) : null}
      <SubscribePopup open={subscribeOpen} onDismiss={() => setSubscribeOpen(false)} />
    </PersonalizationContext.Provider>
  );
}
