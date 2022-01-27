import { render, screen } from "@testing-library/react";
import Button from "./shared/ui-toolkit/Button";

test("check button text", () => {
  render(<Button />);
  const button = screen.getByText(/text/i);
  expect(button).toBeInTheDocument();
});
