import { IFilter } from "./iFilter";
import { areFiltersEquivalent } from "./equivalence";

/** Combines multiple filters with a logical OR. */

export class OneOfFilter implements IFilter {
  public constructor(public readonly filters: IFilter[]) {}

  public toDict(): Record<string, unknown> {
    return { logic: "or", filters: this.filters.map((f) => f.toDict()) };
  }

  public isEquivalentTo(other: IFilter): boolean {
    return areFiltersEquivalent(this, other);
  }
}
