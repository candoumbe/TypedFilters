import { IFilter } from "./iFilter";
import { areFiltersEquivalent } from "./equivalence";

/** Matches records where a property is less than or equal to a value. */
export class LessThanOrEqualFilter implements IFilter {
  public constructor(
    public readonly field: string,
    public readonly value: unknown,
  ) {}

  public toDict(): Record<string, unknown> {
    return { field: this.field, op: "lte", value: this.value };
  }

  public isEquivalentTo(other: IFilter): boolean {
    return areFiltersEquivalent(this, other);
  }

  public get complexity(): number {
    return 8;
  }
}
