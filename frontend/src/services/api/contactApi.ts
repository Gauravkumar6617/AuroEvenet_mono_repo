import { apiClientCore } from "./client";
import { ContactResponse } from "./types";

export const contactApi = {
  sendContactForm(formData: FormData) {
    return apiClientCore.request<ContactResponse>("/api/v1/contact", {
      method: "POST",
      body: formData,
    });
  },
};