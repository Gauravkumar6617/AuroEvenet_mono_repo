import { apiClientCore } from "./client";

export interface OnboardingCategory {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
  topics: OnboardingTopic[];
}

export interface OnboardingTopic {
  id: number;
  name: string;
  slug: string;
  category_id: number;
  is_active: boolean;
  questions: OnboardingQuestion[];
}

export interface OnboardingQuestion {
  id: number;
  question: string;
  topic_id: number;
  page: number;
}

export interface OnboardingResponse {
  categories: OnboardingCategory[];
}

export interface UserPreference {
  id: number;
  user_id: number;
  topic_id?: number;
  question_id?: number;
  answer?: string;
  created_at: string;
}

export interface SaveTopicsRequest {
  topic_ids: number[];
}

export interface SaveAnswersRequest {
  answers: Array<{
    question_id?: number;
    topic_id?: number;
    answer: string;
  }>;
}

export const userApi = {
  getOnboardingData() {
    return apiClientCore.request<OnboardingResponse>("/api/v1/onboarding", {
      method: "GET",
    });
  },

  saveTopics(payload: SaveTopicsRequest) {
    return apiClientCore.request<UserPreference[]>(
      "/api/v1/preferences/topics",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  },

  saveAnswers(payload: SaveAnswersRequest) {
    return apiClientCore.request<UserPreference[]>(
      "/api/v1/preferences/answers",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  },

  markOnboardingComplete() {
    return apiClientCore.request<UserPreference>(
      "/api/v1/preferences/onboarding-complete",
      {
        method: "POST",
      },
    );
  },

  getPreferences() {
    return apiClientCore.request<UserPreference[]>("/api/v1/preferences", {
      method: "GET",
    });
  },

  getMyInterests() {
    return apiClientCore.request<string[]>("/api/v1/user/interests", {
      method: "GET",
    });
  },
};
