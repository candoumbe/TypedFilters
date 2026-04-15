import { IFilter } from "./iFilter";
/** Matches records where a property contains a substring. */
export declare class ContainsFilter implements IFilter {
    readonly field: string;
    readonly value: string;
    constructor(field: string, value: string);
    toDict(): Record<string, unknown>;
    /**
     * Creates a ContainsFilter from a dictionary.
     * @param dict The dictionary to create the filter from. Must have "field", "op", and "value" keys.
     * @returns A new ContainsFilter instance.
     * @throws Error if the dictionary does not have the correct keys or types.
     */
    static fromDict(dict: Record<string, unknown>): ContainsFilter;
}
//# sourceMappingURL=containsFilter.d.ts.map