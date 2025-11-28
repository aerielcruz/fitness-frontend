const API_BASE_URL = "https://fitness-backend-git-main-zekes-projects-ef73a687.vercel.app/api";

export interface User {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface RegisterData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password2: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface Activity {
  id: number;
  title: string;
  description: string;
  status: "planned" | "in progress" | "completed";
  created_at?: string;
  updated_at?: string;
}

export interface CreateActivityData {
  title: string;
  description: string;
  status: "planned" | "in progress" | "completed";
}

export interface UpdateActivityData {
  status: "planned" | "in progress" | "completed";
}

class ApiClient {
  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async register(data: RegisterData): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    return response.json();
  }

  async login(data: LoginData): Promise<TokenResponse> {
    const response = await fetch(`${API_BASE_URL}/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Login failed");
    }

    const tokens = await response.json();
    localStorage.setItem("access_token", tokens.access);
    localStorage.setItem("refresh_token", tokens.refresh);
    return tokens;
  }

  async logout(): Promise<void> {
    const refresh = localStorage.getItem("refresh_token");
    if (!refresh) return;

    try {
      await fetch(`${API_BASE_URL}/auth/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.getAuthHeader(),
        },
        body: JSON.stringify({ refresh }),
      });
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  }

  async getUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me/`, {
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user details");
    }

    return response.json();
  }

  async getActivities(): Promise<Activity[]> {
    const response = await fetch(`${API_BASE_URL}/activities/`, {
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch activities");
    }

    return response.json();
  }

  async createActivity(data: CreateActivityData): Promise<Activity> {
    const response = await fetch(`${API_BASE_URL}/activities/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create activity");
    }

    return response.json();
  }

  async updateActivity(id: number, data: UpdateActivityData): Promise<Activity> {
    const response = await fetch(`${API_BASE_URL}/activities/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update activity");
    }

    return response.json();
  }

  async deleteActivity(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/activities/${id}/`, {
      method: "DELETE",
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error("Failed to delete activity");
    }
  }
}

export const api = new ApiClient();
