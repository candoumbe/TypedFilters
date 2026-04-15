"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartsWithFilter = void 0;
/** Matches records where a property starts with a specific string. */
class StartsWithFilter {
    constructor(field, value) {
        this.field = field;
        this.value = value;
    }
    toDict() {
        return { field: this.field, op: 'startswith', value: this.value };
    }
}
exports.StartsWithFilter = StartsWithFilter;
//# sourceMappingURL=startsWithFilter.js.map