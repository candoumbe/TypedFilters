/** Base interface for all filter expressions. */
export interface IFilter {
  /** Converts the filter to a dictionary representation. */
  toDict(): Record<string, unknown>;

  /** Tests whether this filter is equivalent to another filter. */
  isEquivalentTo(other: IFilter): boolean;

  /** Returns the complexity of this filter. Always >= 1. */
  readonly complexity: number;
}
