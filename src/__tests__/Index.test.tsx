import { describe, it, beforeEach, vi, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Index from "../pages/Index";
import { MemoryRouter } from "react-router-dom";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Index page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("redirects to /dashboard if token exists", () => {
    localStorage.setItem("access_token", "mock-token");

    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("does not redirect if no token", () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("renders welcome text and feature cards", () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    expect(screen.getByText(/Welcome to FitTrack/i)).toBeInTheDocument();
    expect(screen.getByText(/Your personal fitness companion/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Track Activities/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Monitor Progress/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Stay Motivated/i)).toBeInTheDocument();
  });

  it("navigates to /auth when Get Started button is clicked", () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Get Started/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/auth");
  });

  it("navigates to /auth when Sign In button is clicked", () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/auth");
  });
});
