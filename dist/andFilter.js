"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AndFilter = void 0;
/** Combines multiple filters with a logical AND. */
class AndFilter {
    constructor(filters) {
        this.filters = filters;
    }
    toDict() {
        return { logic: 'and', filters: this.filters.map((f) => f.toDict()) };
    }
}
exports.AndFilter = AndFilter;
//# sourceMappingURL=andFilter.js.map