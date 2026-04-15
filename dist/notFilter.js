"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFilter = void 0;
/** Negates a filter expression. */
class NotFilter {
    constructor(filter) {
        this.filter = filter;
    }
    toDict() {
        return { logic: "not", filters: [this.filter.toDict()] };
    }
}
exports.NotFilter = NotFilter;
//# sourceMappingURL=notFilter.js.map