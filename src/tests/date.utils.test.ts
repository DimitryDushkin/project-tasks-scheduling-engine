import { shiftToFirstNextBusinessDay } from "../date.utils";

describe("date.utils", () => {
  it("should shift +2 days if on saturday", () => {
    expect(shiftToFirstNextBusinessDay(new Date("2020-02-22"))).toEqual(
      new Date("2020-02-24")
    );
  });

  it("should shift +1 day if on sunday", () => {
    expect(shiftToFirstNextBusinessDay(new Date("2020-02-23"))).toEqual(
      new Date("2020-02-24")
    );
  });

  it("should not shift if on businessday", () => {
    expect(shiftToFirstNextBusinessDay(new Date("2020-02-24"))).toEqual(
      new Date("2020-02-24")
    );
    expect(shiftToFirstNextBusinessDay(new Date("2020-02-25"))).toEqual(
      new Date("2020-02-25")
    );
  });
});
