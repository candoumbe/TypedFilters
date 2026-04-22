import { IFilter } from "./iFilter";
import { areFiltersEquivalent } from "./equivalence";

/** Matches records where a property is less than a value. */
export class LessThanFilter implements IFilter {
  public constructor(
    public readonly field: string,
    public readonly value: unknown,
  ) {}

  public toDict(): Record<string, unknown> {
    return { field: this.field, op: "lt", value: this.value };
  }

  public isEquivalentTo(other: IFilter): boolean {
    return areFiltersEquivalent(this, other);
  }

  public get complexity(): number {
    return 7;
  }
}
