import { describe, it, beforeEach, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Auth from "../pages/Auth";
import { AuthProvider } from "../contexts/AuthContext";

describe("Auth component", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Auth />
        </AuthProvider>
      </MemoryRouter>
    );
  });

  it("renders login and register tabs", async () => {
    expect(await screen.findByRole("tab", { name: /Login/i })).toBeInTheDocument();
    expect(await screen.findByRole("tab", { name: /Register/i })).toBeInTheDocument();
  });

  it("handles successful login", async () => {
    fireEvent.change(await screen.findByLabelText(/^Username$/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(await screen.findByLabelText(/^Password$/i), {
      target: { value: "password" },
    });

    fireEvent.click(await screen.findByRole("button", { name: /^Login$/i }));

    // Replace with your post-login assertion
    // expect(await screen.findByText(/Welcome back/i)).toBeInTheDocument();
  });

  it("handles login failure", async () => {
    fireEvent.change(await screen.findByLabelText(/^Username$/i), {
      target: { value: "wronguser" },
    });
    fireEvent.change(await screen.findByLabelText(/^Password$/i), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(await screen.findByRole("button", { name: /^Login$/i }));

    // Replace with your failure assertion
    // expect(await screen.findByText(/Invalid credentials/i)).toBeInTheDocument();
  });
});
