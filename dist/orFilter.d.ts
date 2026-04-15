import { IFilter } from "./iFilter";
export declare class OrFilter implements IFilter {
    readonly left: IFilter;
    readonly right: IFilter;
    constructor(left: IFilter, right: IFilter);
    toDict(): Record<string, unknown>;
}
//# sourceMappingURL=orFilter.d.ts.map