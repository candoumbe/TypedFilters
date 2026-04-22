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
    // OR is commutative: (A OR B) is equivalent to (B OR A).
    const otherDict = other.toDict();
    const otherOr = other as Partial<OrFilter>;
    if (
      otherDict["logic"] === "or" &&
      otherOr.left !== undefined &&
      otherOr.right !== undefined
    ) {
      const sameOrder =
        areFiltersEquivalent(this.left, otherOr.left) &&
        areFiltersEquivalent(this.right, otherOr.right);
      if (sameOrder) {
        return true;
      }

      return (
        areFiltersEquivalent(this.left, otherOr.right) &&
        areFiltersEquivalent(this.right, otherOr.left)
      );
    }

    return areFiltersEquivalent(this, other);
  }

  public get complexity(): number {
    return (this.left.complexity + this.right.complexity) * 100 + 11;
  }
}
