import React from "react";
import {
  fireEvent,
  getByText,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import App from "./App";
import { act } from "react-dom/test-utils";

test("create new task button should visible", () => {
  render(<App />);
  const linkElement = screen.getByText(/create new task/i);
  expect(linkElement).toBeInTheDocument();
});

test("add task form should visible", () => {
  render(<App />);
  const linkElement = screen.getByText(/create new task/i);
  act(() => {
    linkElement.click();
  });
  waitFor(() => {
    const taskForm = screen.getByTestId("taskForm");
    expect(taskForm).toBeInTheDocument();
  });
});

test("should show error", () => {
  window.alert = jest.fn();
  render(<App />);
  const linkElement = screen.getByText(/create new task/i);
  act(() => {
    linkElement.click();
  });
  waitFor(() => {
    const taskForm = screen.getByTestId("taskForm");
    act(() => {
      fireEvent(
        getByText(taskForm, "Save"),
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
        })
      );
    });
    expect(window.alert).toHaveBeenCalledTimes(1);
  });
});
