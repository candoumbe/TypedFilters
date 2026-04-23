import { IFilter } from "./iFilter";
import { areFiltersEquivalent } from "./equivalence";

/** Matches records where a property ends with a specific string. */
export class EndsWithFilter implements IFilter {
  public constructor(
    public readonly field: string,
    public readonly value: string,
  ) {}

  public toDict(): Record<string, unknown> {
    return { field: this.field, op: "endswith", value: this.value };
  }

  public isEquivalentTo(other: IFilter): boolean {
    return areFiltersEquivalent(this, other);
  }

  public get complexity(): number {
    return 4;
  }
}
