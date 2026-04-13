import { render, screen } from "@testing-library/react";
import { SkipLink } from "@/components/SkipLink";

describe("SkipLink", () => {
  it("renders a skip link to main content", () => {
    render(<SkipLink />);
    expect(
      screen.getByRole("link", { name: /saltar al contenido/i }),
    ).toHaveAttribute("href", "#main-content");
  });
});
