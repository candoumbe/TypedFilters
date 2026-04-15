"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneOfFilter = void 0;
/** Combines multiple filters with a logical OR. */
class OneOfFilter {
    constructor(filters) {
        this.filters = filters;
    }
    toDict() {
        return { logic: "or", filters: this.filters.map((f) => f.toDict()) };
    }
}
exports.OneOfFilter = OneOfFilter;
//# sourceMappingURL=oneOfFilter.js.map