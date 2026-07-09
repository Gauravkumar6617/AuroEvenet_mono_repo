import { apiClientCore } from "./client";

export interface NewsletterSubscribeResponse {
  message: string;
  already_subscribed: boolean;
}

export const newsletterApi = {
  subscribe(email: string) {
    return apiClientCore.request<NewsletterSubscribeResponse>(
      "/api/v1/newsletter/subscribe",
      { method: "POST", body: JSON.stringify({ email }) },
      false,
      null,
      false,
      false,
    );
  },

  unsubscribe(email: string) {
    return apiClientCore.request<NewsletterSubscribeResponse>(
      "/api/v1/newsletter/unsubscribe",
      { method: "POST", body: JSON.stringify({ email }) },
      false,
      null,
      false,
      false,
    );
  },
};
