import { IFilter } from "./iFilter";
import { areFiltersEquivalent } from "./equivalence";

export class OrFilter implements IFilter {
  public constructor(
    public readonly left: IFilter,
    public readonly right: IFilter,
  ) {}

  public toDict(): Record<string, unknown> {
    return { logic: "or", filters: [this.left.toDict(), this.right.toDict()] };
  }

  public isEquivalentTo(other: IFilter): boolean {
    return areFiltersEquivalent(this, other);
  }
}
