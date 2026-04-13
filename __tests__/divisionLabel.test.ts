import { divisionLabel } from "@/lib/format/division";

describe("divisionLabel", () => {
  it("maps known divisions", () => {
    expect(divisionLabel("men")).toBe("Masculino");
    expect(divisionLabel("women")).toBe("Femenino");
    expect(divisionLabel("mixed")).toBe("Mixto");
  });
});
