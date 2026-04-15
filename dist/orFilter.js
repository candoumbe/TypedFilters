"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrFilter = void 0;
class OrFilter {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }
    toDict() {
        return { logic: "or", filters: [this.left.toDict(), this.right.toDict()] };
    }
}
exports.OrFilter = OrFilter;
//# sourceMappingURL=orFilter.js.map