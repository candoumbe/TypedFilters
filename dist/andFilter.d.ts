import { IFilter } from './iFilter';
/** Combines multiple filters with a logical AND. */
export declare class AndFilter implements IFilter {
    readonly filters: IFilter[];
    constructor(filters: IFilter[]);
    toDict(): Record<string, unknown>;
}
//# sourceMappingURL=andFilter.d.ts.map