import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import NotFound from "../pages/NotFound";

describe("NotFound component", () => {
  it("renders 404 page and logs attempted path", async () => {
    const testPath = "/non-existent-path";

    // Mock console.error
    const consoleErrorMock = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <MemoryRouter initialEntries={[testPath]}>
        <Routes>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MemoryRouter>
    );

    // Check that 404 text is rendered
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText(/Oops! Page not found/i)).toBeInTheDocument();
    expect(screen.getByText(/Return to Home/i)).toBeInTheDocument();

    // Wait for useEffect to run and assert console.error
    await waitFor(() => {
      expect(consoleErrorMock).toHaveBeenCalledWith(
        "404 Error: User attempted to access non-existent route:",
        testPath
      );
    });

    // Restore mock
    consoleErrorMock.mockRestore();
  });
});
