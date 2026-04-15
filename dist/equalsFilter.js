"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EqualsFilter = void 0;
/** Matches records where a property equals a specific value. */
class EqualsFilter {
    constructor(field, value) {
        this.field = field;
        this.value = value;
    }
    toDict() {
        return { field: this.field, op: 'eq', value: this.value };
    }
}
exports.EqualsFilter = EqualsFilter;
//# sourceMappingURL=equalsFilter.js.map