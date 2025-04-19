// frontend/src/App.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders header and placeholder on startup", () => {
  render(<App />);
  expect(screen.getByText(/Feed Fusion AI/i)).toBeInTheDocument();
  expect(screen.getByText(/Select a feed to see its items/i)).toBeInTheDocument();
});