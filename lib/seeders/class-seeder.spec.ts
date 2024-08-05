import { getSeedFactories } from "./class-seeder";
import { Seed } from "../decorators";
import { SeederFactory } from "../seeder/seeder.factory";

describe("Inheritance", () => {
  it("should prioritize child class factories", () => {
    const fac1 = () => 1;
    const fac2 = () => 2;
    const fac3 = () => 3;

    class X {
      @Seed(fac1)
      a: number;

      @Seed(fac2)
      b: number;
    }
    class Y extends X {
      @Seed(fac3)
      b: number;
    }
    expect(getSeedFactories(Y)).toEqual({
      a: new SeederFactory("a", fac1),
      b: new SeederFactory("b", fac3),
    });

    // Repeat the test, swapping the parent and child factory, to verify that inheritance
    // dictatest the outcome, and not arbitrary object comparisons.
    class X2 {
      @Seed(fac1)
      a: number;

      @Seed(fac3)
      b: number;
    }
    class Y2 extends X2 {
      @Seed(fac2)
      b: number;
    }
    expect(getSeedFactories(Y2)).toEqual({
      a: new SeederFactory("a", fac1),
      b: new SeederFactory("b", fac2),
    });
  });
});
