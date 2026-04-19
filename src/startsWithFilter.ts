import { IFilter } from "./iFilter";
import { areFiltersEquivalent } from "./equivalence";

/** Matches records where a property starts with a specific string. */
export class StartsWithFilter implements IFilter {
  public constructor(
    public readonly field: string,
    public readonly value: string,
  ) {}

  public toDict(): Record<string, unknown> {
    return { field: this.field, op: "startswith", value: this.value };
  }

  public isEquivalentTo(other: IFilter): boolean {
    return areFiltersEquivalent(this, other);
  }
}
