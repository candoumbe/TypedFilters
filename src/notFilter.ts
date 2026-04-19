import { IFilter } from "./iFilter";
import { areFiltersEquivalent } from "./equivalence";

/** Negates a filter expression. */
export class NotFilter implements IFilter {
  public constructor(public readonly filter: IFilter) {}

  public toDict(): Record<string, unknown> {
    return { logic: "not", filters: [this.filter.toDict()] };
  }

  public isEquivalentTo(other: IFilter): boolean {
    return areFiltersEquivalent(this, other);
  }
}
