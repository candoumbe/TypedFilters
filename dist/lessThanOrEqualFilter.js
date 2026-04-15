"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessThanOrEqualFilter = void 0;
/** Matches records where a property is less than or equal to a value. */
class LessThanOrEqualFilter {
    constructor(field, value) {
        this.field = field;
        this.value = value;
    }
    toDict() {
        return { field: this.field, op: 'lte', value: this.value };
    }
}
exports.LessThanOrEqualFilter = LessThanOrEqualFilter;
//# sourceMappingURL=lessThanOrEqualFilter.js.map