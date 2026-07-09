import { apiClientCore } from "./client";
import { ContactResponse } from "./types";

export const contactApi = {
  sendContactForm(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) {
    return apiClientCore.request<ContactResponse>("/api/v1/contact/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },
};
