import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const defaultPrefs = () => ({
  city: "",
  lat: null,
  lng: null,
  geoLabel: "",
  interests: [],
  modes: [],
  digest_email: "",
  digest_opt_in: false,
});

const usePersonalizationStore = create(
  persist(
    (set, get) => ({
      /** User finished wizard (save) or skipped forever */
      onboardingClosed: false,
      /** User chose “don’t personalize” permanently */
      tasteDisabled: false,

      prefs: defaultPrefs(),

      /** millis timestamp — hide subscribe sheet until passed */
      subscribeHiddenUntil: 0,

      setPrefs(patch) {
        set({ prefs: { ...get().prefs, ...patch } });
      },

      finalizeTaste(patch) {
        set({
          prefs: { ...get().prefs, ...patch },
          onboardingClosed: true,
          tasteDisabled: false,
        });
      },

      /** Close wizard without personalised signals */
      skipTastePermanent() {
        set({
          onboardingClosed: true,
          tasteDisabled: true,
          prefs: defaultPrefs(),
        });
      },

      suppressSubscribe(days = 14) {
        set({ subscribeHiddenUntil: Date.now() + days * 86400000 });
      },

      acknowledgeSubscribe(email) {
        set((s) => ({
          prefs: {
            ...s.prefs,
            digest_email: email || s.prefs.digest_email,
            digest_opt_in: true,
          },
          subscribeHiddenUntil: Date.now() + 365 * 86400000,
        }));
      },

      subscribeVisible() {
        return Date.now() > (get().subscribeHiddenUntil || 0);
      },
    }),
    {
      name: "aura-events-personalization-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        onboardingClosed: s.onboardingClosed,
        tasteDisabled: s.tasteDisabled,
        prefs: s.prefs,
        subscribeHiddenUntil: s.subscribeHiddenUntil,
      }),
    },
  ),
);

export default usePersonalizationStore;
