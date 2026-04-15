"use strict";
/**
 * DataFilters TypeScript SDK.
 *
 * Generate filter expressions compatible with the DataFilters C# library,
 * using an Elasticsearch-inspired query syntax.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromDict = exports.toJson = exports.toDict = exports.FilterOptions = exports.FilterLogic = exports.parse = exports.FieldBuilder = exports.FilterBuilder = exports.NotFilter = exports.OrFilter = exports.AndFilter = exports.LessThanOrEqualFilter = exports.LessThanFilter = exports.GreaterThanOrEqualFilter = exports.GreaterThanFilter = exports.EndsWithFilter = exports.StartsWithFilter = exports.ContainsFilter = exports.EqualsFilter = void 0;
var expressions_1 = require("./expressions");
Object.defineProperty(exports, "EqualsFilter", { enumerable: true, get: function () { return expressions_1.EqualsFilter; } });
Object.defineProperty(exports, "ContainsFilter", { enumerable: true, get: function () { return expressions_1.ContainsFilter; } });
Object.defineProperty(exports, "StartsWithFilter", { enumerable: true, get: function () { return expressions_1.StartsWithFilter; } });
Object.defineProperty(exports, "EndsWithFilter", { enumerable: true, get: function () { return expressions_1.EndsWithFilter; } });
Object.defineProperty(exports, "GreaterThanFilter", { enumerable: true, get: function () { return expressions_1.GreaterThanFilter; } });
Object.defineProperty(exports, "GreaterThanOrEqualFilter", { enumerable: true, get: function () { return expressions_1.GreaterThanOrEqualFilter; } });
Object.defineProperty(exports, "LessThanFilter", { enumerable: true, get: function () { return expressions_1.LessThanFilter; } });
Object.defineProperty(exports, "LessThanOrEqualFilter", { enumerable: true, get: function () { return expressions_1.LessThanOrEqualFilter; } });
Object.defineProperty(exports, "AndFilter", { enumerable: true, get: function () { return expressions_1.AndFilter; } });
Object.defineProperty(exports, "OrFilter", { enumerable: true, get: function () { return expressions_1.OrFilter; } });
Object.defineProperty(exports, "NotFilter", { enumerable: true, get: function () { return expressions_1.NotFilter; } });
var builder_1 = require("./builder");
Object.defineProperty(exports, "FilterBuilder", { enumerable: true, get: function () { return builder_1.FilterBuilder; } });
Object.defineProperty(exports, "FieldBuilder", { enumerable: true, get: function () { return builder_1.FieldBuilder; } });
var parser_1 = require("./parser");
Object.defineProperty(exports, "parse", { enumerable: true, get: function () { return parser_1.parse; } });
var filterOptions_1 = require("./filterOptions");
Object.defineProperty(exports, "FilterLogic", { enumerable: true, get: function () { return filterOptions_1.FilterLogic; } });
Object.defineProperty(exports, "FilterOptions", { enumerable: true, get: function () { return filterOptions_1.FilterOptions; } });
var serializers_1 = require("./serializers");
Object.defineProperty(exports, "toDict", { enumerable: true, get: function () { return serializers_1.toDict; } });
Object.defineProperty(exports, "toJson", { enumerable: true, get: function () { return serializers_1.toJson; } });
Object.defineProperty(exports, "fromDict", { enumerable: true, get: function () { return serializers_1.fromDict; } });
//# sourceMappingURL=index.js.map