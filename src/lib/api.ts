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

  private async refreshToken(): Promise<void> {
    const refresh = localStorage.getItem("refresh_token");
    if (!refresh) throw new Error("No refresh token available");

    const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (!response.ok) {
      this.logout();
      throw new Error("Session expired. Please log in again.");
    }

    const data = await response.json();
    localStorage.setItem("access_token", data.access);
  }

  private async fetchWithAuth(input: RequestInfo, init?: RequestInit) {
    let response = await fetch(input, {
      ...init,
      headers: { ...(init?.headers || {}), ...this.getAuthHeader() },
    });

    // If 401, try refreshing token and retry
    if (response.status === 401) {
      try {
        await this.refreshToken();
        response = await fetch(input, {
          ...init,
          headers: { ...(init?.headers || {}), ...this.getAuthHeader() },
        });
      } catch (err) {
        throw err; // If refresh fails, propagate error
      }
    }

    return response;
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
        headers: { "Content-Type": "application/json", ...this.getAuthHeader() },
        body: JSON.stringify({ refresh }),
      });
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  }

  async getUser(): Promise<User> {
    const response = await this.fetchWithAuth(`${API_BASE_URL}/auth/me/`);
    if (!response.ok) throw new Error("Failed to fetch user details");
    return response.json();
  }

  async getActivities(): Promise<Activity[]> {
    const response = await this.fetchWithAuth(`${API_BASE_URL}/activities/`);
    if (!response.ok) throw new Error("Failed to fetch activities");
    return response.json();
  }

  async createActivity(data: CreateActivityData): Promise<Activity> {
    const response = await this.fetchWithAuth(`${API_BASE_URL}/activities/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Failed to create activity");
    return response.json();
  }

  async updateActivity(id: number, data: UpdateActivityData): Promise<Activity> {
    const response = await this.fetchWithAuth(`${API_BASE_URL}/activities/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Failed to update activity");
    return response.json();
  }

  async deleteActivity(id: number): Promise<void> {
    const response = await this.fetchWithAuth(`${API_BASE_URL}/activities/${id}/`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete activity");
  }
}

export const api = new ApiClient();