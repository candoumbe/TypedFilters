import { IFilter } from "./iFilter";
/** Combines multiple filters with a logical OR. */
export declare class OneOfFilter implements IFilter {
    readonly filters: IFilter[];
    constructor(filters: IFilter[]);
    toDict(): Record<string, unknown>;
}
//# sourceMappingURL=oneOfFilter.d.ts.map