import { describe, it, beforeEach, vi, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Dashboard from "../pages/Dashboard";
import { MemoryRouter } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../lib/api";
import { useToast } from "../hooks/use-toast";

// Mock dependencies
vi.mock("../contexts/AuthContext");
vi.mock("../lib/api");
vi.mock("../hooks/use-toast");
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe("Dashboard component", () => {
  const mockNavigate = vi.fn();
  const mockToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useAuth as any).mockReturnValue({
      user: { first_name: "John" },
      logout: vi.fn(),
      loading: false,
    });

    (useToast as any).mockReturnValue({ toast: mockToast });

    (api.getActivities as any).mockResolvedValue([
      { id: 1, title: "Run", description: "Morning run", status: "planned" },
      { id: 2, title: "Swim", description: "Pool session", status: "completed" },
    ]);
  });

  it("renders loading state initially", async () => {
    (useAuth as any).mockReturnValue({ user: null, loading: true, logout: vi.fn() });
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("renders activities after loading", async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(await screen.findByText("Run")).toBeInTheDocument();
    expect(screen.getByText("Swim")).toBeInTheDocument();
  });

  it("shows empty state when no activities", async () => {
    (api.getActivities as any).mockResolvedValue([]);
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(await screen.findByText(/No activities found/i)).toBeInTheDocument();
  });
});
