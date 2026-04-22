import { IFilter } from "./iFilter";
import { areFiltersEquivalent } from "./equivalence";

/** Combines multiple filters with a logical AND. */
export class AndFilter implements IFilter {
  public constructor(public readonly filters: IFilter[]) {}

  public toDict(): Record<string, unknown> {
    return { logic: "and", filters: this.filters.map((f) => f.toDict()) };
  }

  public isEquivalentTo(other: IFilter): boolean {
    return areFiltersEquivalent(this, other);
  }

  public get complexity(): number {
    return this.filters.reduce((sum, f) => sum + f.complexity, 0) * 100 + 10;
  }
}
