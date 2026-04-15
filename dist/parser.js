"use strict";
/**
 * Parser for DataFilters query syntax strings.
 *
 * Uses Chevrotain for lexer and parser implementation,
 * mirroring the C# FilterTokenParser grammar.
 *
 * Supported syntax:
 *   - `field=value`            → EqualsFilter
 *   - `field=value*`           → StartsWithFilter
 *   - `field=*value`           → EndsWithFilter
 *   - `field=*value*`          → ContainsFilter
 *   - `field=!value`           → NotFilter(EqualsFilter)
 *   - `field=[min TO max]`     → AndFilter(gte, lte)
 *   - `field=[min TO *[`       → GreaterThanOrEqualFilter
 *   - `field=]* TO max]`       → LessThanOrEqualFilter
 *   - `field=]min TO max[`     → AndFilter(gt, lt)
 *   - `field=expr1,expr2`      → AndFilter (same field)
 *   - `field=expr1|expr2`      → OrFilter
 *   - `field1=v1&field2=v2`    → AndFilter or OrFilter based on options
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = parse;
const chevrotain_1 = require("chevrotain");
const expressions_1 = require("./expressions");
const filterOptions_1 = require("./filterOptions");
// ===== Token Definitions =====
//
// Text must be defined before TO so that longer_alt can reference it.
// The token array order governs tie-breaking: TO is listed before Text so
// that the exact string "TO" tokenises as the keyword. For longer strings
// such as "TORONTO", longer_alt ensures Text wins via maximum munch.
/** Backslash followed by any character — the leading backslash is stripped at parse time. */
const Escaped = (0, chevrotain_1.createToken)({ name: "Escaped", pattern: /\\[\s\S]/ });
/** Any run of non-reserved characters. Excludes: \\ = , | ! * [ ] and whitespace. */
const Text = (0, chevrotain_1.createToken)({ name: "Text", pattern: /[^\\=,|!*[\]\s]+/ });
/** Range separator keyword. longer_alt ensures "TORONTO" stays a single Text token. */
const TO = (0, chevrotain_1.createToken)({ name: "TO", pattern: /TO/, longer_alt: [Text] });
const Comma = (0, chevrotain_1.createToken)({ name: "Comma", pattern: /,/ });
const Pipe = (0, chevrotain_1.createToken)({ name: "Pipe", pattern: /\|/ });
const Bang = (0, chevrotain_1.createToken)({ name: "Bang", pattern: /!/ });
const Asterisk = (0, chevrotain_1.createToken)({ name: "Asterisk", pattern: /\*/ });
const LeftSquare = (0, chevrotain_1.createToken)({ name: "LeftSquare", pattern: /\[/ });
const RightSquare = (0, chevrotain_1.createToken)({ name: "RightSquare", pattern: /\]/ });
const Equals = (0, chevrotain_1.createToken)({ name: "Equals", pattern: /=/ });
/** Whitespace is silently skipped everywhere, including around TO in ranges. */
const Whitespace = (0, chevrotain_1.createToken)({
    name: "Whitespace",
    pattern: /\s+/,
    group: chevrotain_1.Lexer.SKIPPED,
});
const ALL_TOKENS = [
    Escaped,
    TO,
    Comma,
    Pipe,
    Bang,
    Asterisk,
    LeftSquare,
    RightSquare,
    Equals,
    Whitespace,
    Text,
];
const FILTER_LEXER = new chevrotain_1.Lexer(ALL_TOKENS);
// ===== Helpers =====
/** Return the semantic value of a token, stripping the leading backslash from Escaped tokens. */
function tokenValue(token) {
    let result;
    if (token.tokenType === Escaped) {
        result = token.image.slice(1);
    }
    else {
        result = token.image;
    }
    return result;
}
// ===== Pre-processing: URL-decode and normalise =====
function decodeQueryComponent(value) {
    const normalized = value.replace(/\+/g, " ");
    let result;
    try {
        result = decodeURIComponent(normalized);
    }
    catch {
        result = normalized;
    }
    return result;
}
/**
 * Split on unencoded ampersands first (so %26 inside values is preserved),
 * URL-decode each field=value segment independently, then rejoin with commas
 * so the Chevrotain grammar only needs a single separator token.
 *
 * Backslash-escaped ampersands (\&) are treated as literal ampersand
 * characters and do NOT trigger a split.  An even number of leading
 * backslashes means the last backslash is itself escaped, so the `&` IS
 * a separator (e.g. "foo\\&bar" → two parts, because `\\` is an escaped
 * backslash and `&` is the field separator).
 */
function normalizeExpression(expression) {
    const withoutPrefix = expression.startsWith("?")
        ? expression.slice(1)
        : expression;
    const rawParts = [];
    let current = "";
    for (let i = 0; i < withoutPrefix.length; i++) {
        const char = withoutPrefix[i];
        if (char === "&") {
            // Count how many backslashes immediately precede this `&`.
            let backslashCount = 0;
            let j = i - 1;
            while (j >= 0 && withoutPrefix[j] === "\\") {
                backslashCount++;
                j--;
            }
            // An odd number of backslashes means this `&` is escaped.
            if (backslashCount % 2 === 1) {
                current += char;
            }
            else {
                rawParts.push(current);
                current = "";
            }
        }
        else {
            current += char;
        }
    }
    rawParts.push(current);
    let result;
    if (rawParts.length <= 1) {
        result = decodeQueryComponent(withoutPrefix);
    }
    else {
        const normalizedParts = rawParts
            .map((part) => part.trim())
            .filter((part) => part.length > 0)
            .map((part) => {
            const eqIndex = part.indexOf("=");
            let normalizedPart;
            if (eqIndex === -1) {
                normalizedPart = decodeQueryComponent(part);
            }
            else {
                const field = decodeQueryComponent(part.slice(0, eqIndex));
                const value = decodeQueryComponent(part.slice(eqIndex + 1));
                normalizedPart = `${field}=${value}`;
            }
            return normalizedPart;
        });
        result = normalizedParts.join(",");
    }
    return result;
}
class InternalFilterParser extends chevrotain_1.EmbeddedActionsParser {
    constructor() {
        super(ALL_TOKENS, { recoveryEnabled: false });
        /** Field name set by the most recent fieldAssignment rule. */
        this.currentField = "";
        /** Accumulated (filter, field) pairs, one per comma-separated input part. */
        this.parsedParts = [];
        /** Every distinct field name explicitly introduced in this parse call. */
        this.encounteredFields = new Set();
        // ---------------------------------------------------------------------------
        // Grammar rules
        // ---------------------------------------------------------------------------
        /**
         * Top-level rule: one or more comma-separated field-or-value parts.
         * Returns the combined IFilter.
         */
        this.filterInput = this.RULE("filterInput", () => {
            this.SUBRULE(this.fieldOrValuePart);
            this.MANY(() => {
                this.CONSUME(Comma);
                this.SUBRULE2(this.fieldOrValuePart);
            });
            return this.ACTION(() => this.buildResult());
        });
        /**
         * Dispatches to fieldAssignment when the upcoming tokens look like
         * "fieldName =", otherwise falls through to inheritedValuePart.
         */
        this.fieldOrValuePart = this.RULE("fieldOrValuePart", () => {
            this.OR([
                {
                    GATE: () => this.isFieldAssignmentStart(),
                    ALT: () => {
                        this.SUBRULE(this.fieldAssignment);
                    },
                },
                {
                    ALT: () => {
                        this.SUBRULE(this.inheritedValuePart);
                    },
                },
            ]);
        });
        /** Parses "fieldName = valueExpression" and records the result. */
        this.fieldAssignment = this.RULE("fieldAssignment", () => {
            const field = this.SUBRULE(this.fieldNameRule);
            this.CONSUME(Equals);
            this.ACTION(() => {
                this.currentField = field;
                this.encounteredFields.add(field);
            });
            const filter = this.SUBRULE(this.valueExpression);
            this.ACTION(() => {
                this.parsedParts.push({ filter, field });
            });
        });
        /** Parses a value expression that inherits the field from the last assignment. */
        this.inheritedValuePart = this.RULE("inheritedValuePart", () => {
            const field = this.currentField;
            this.ACTION(() => {
                if (!field) {
                    throw new Error("Cannot determine field for expression part: no inherited field available");
                }
            });
            const filter = this.SUBRULE(this.valueExpression);
            this.ACTION(() => {
                this.parsedParts.push({ filter, field });
            });
        });
        /**
         * A value expression: either a range ([min TO max]) or a
         * pipe-separated expression.
         */
        this.valueExpression = this.RULE("valueExpression", () => {
            let result;
            this.OR([
                {
                    GATE: () => {
                        const tt = this.LA(1).tokenType;
                        return tt === LeftSquare || tt === RightSquare;
                    },
                    ALT: () => {
                        result = this.SUBRULE(this.rangeExpression);
                    },
                },
                {
                    ALT: () => {
                        result = this.SUBRULE(this.pipeExpression);
                    },
                },
            ]);
            return result;
        });
        /**
         * Pipe-separated alternatives: "a|b" produces OrFilter, "a|b|c" produces
         * OneOfFilter.
         */
        this.pipeExpression = this.RULE("pipeExpression", () => {
            const first = this.SUBRULE(this.negatedExpr);
            const parts = [first];
            this.MANY(() => {
                this.CONSUME(Pipe);
                parts.push(this.SUBRULE2(this.negatedExpr));
            });
            let result;
            if (parts.length === 1) {
                result = parts[0];
            }
            else if (parts.length === 2) {
                result = new expressions_1.OrFilter(parts[0], parts[1]);
            }
            else {
                result = new expressions_1.OneOfFilter(parts);
            }
            return result;
        });
        /** Optional "!" negation prefix followed by a primary expression. */
        this.negatedExpr = this.RULE("negatedExpr", () => {
            let negated = false;
            this.OPTION(() => {
                this.CONSUME(Bang);
                this.ACTION(() => {
                    negated = true;
                });
            });
            const inner = this.SUBRULE(this.primaryExpr);
            const result = this.ACTION(() => negated ? new expressions_1.NotFilter(inner) : inner);
            return result;
        });
        /**
         * Primary value expression:
         *   - "*val*"  ContainsFilter
         *   - "*val"   EndsWithFilter
         *   - "val*"   StartsWithFilter
         *   - "val"    EqualsFilter
         */
        this.primaryExpr = this.RULE("primaryExpr", () => {
            const field = this.currentField;
            let hasLeadingAsterisk = false;
            let hasTrailingAsterisk = false;
            this.OPTION(() => {
                this.CONSUME(Asterisk);
                this.ACTION(() => {
                    hasLeadingAsterisk = true;
                });
            });
            const val = this.SUBRULE(this.valueTextChunks);
            this.OPTION2(() => {
                this.CONSUME2(Asterisk);
                this.ACTION(() => {
                    hasTrailingAsterisk = true;
                });
            });
            const result = this.ACTION(() => {
                let filter;
                if (hasLeadingAsterisk && hasTrailingAsterisk) {
                    filter = new expressions_1.ContainsFilter(field, val);
                }
                else if (hasLeadingAsterisk) {
                    filter = new expressions_1.EndsWithFilter(field, val);
                }
                else if (hasTrailingAsterisk) {
                    filter = new expressions_1.StartsWithFilter(field, val);
                }
                else {
                    filter = new expressions_1.EqualsFilter(field, val);
                }
                return filter;
            });
            return result;
        });
        /**
         * Range expression: ([|]) rangeValue TO rangeValue (]|[)
         *
         * Opening "[" means inclusive lower bound; opening "]" means exclusive.
         * Closing "]" means inclusive upper bound; closing "[" means exclusive.
         * "*" as a bound value means unbounded (no filter generated for that side).
         */
        this.rangeExpression = this.RULE("rangeExpression", () => {
            const field = this.currentField;
            let openInclusive = true;
            this.OR([
                {
                    ALT: () => {
                        this.CONSUME(LeftSquare);
                        this.ACTION(() => {
                            openInclusive = true;
                        });
                    },
                },
                {
                    ALT: () => {
                        this.CONSUME(RightSquare);
                        this.ACTION(() => {
                            openInclusive = false;
                        });
                    },
                },
            ]);
            let minValue;
            this.OR2([
                {
                    ALT: () => {
                        this.CONSUME(Asterisk);
                    },
                },
                {
                    ALT: () => {
                        minValue = this.SUBRULE(this.rangeValueChunks);
                    },
                },
            ]);
            this.CONSUME(TO);
            let maxValue;
            this.OR3([
                {
                    ALT: () => {
                        this.CONSUME2(Asterisk);
                    },
                },
                {
                    ALT: () => {
                        maxValue = this.SUBRULE2(this.rangeValueChunks);
                    },
                },
            ]);
            let closeInclusive = true;
            this.OR4([
                {
                    ALT: () => {
                        this.CONSUME2(RightSquare);
                        this.ACTION(() => {
                            closeInclusive = true;
                        });
                    },
                },
                {
                    ALT: () => {
                        this.CONSUME2(LeftSquare);
                        this.ACTION(() => {
                            closeInclusive = false;
                        });
                    },
                },
            ]);
            const result = this.ACTION(() => {
                const filters = [];
                if (minValue !== undefined) {
                    filters.push(openInclusive
                        ? new expressions_1.GreaterThanOrEqualFilter(field, minValue)
                        : new expressions_1.GreaterThanFilter(field, minValue));
                }
                if (maxValue !== undefined) {
                    filters.push(closeInclusive
                        ? new expressions_1.LessThanOrEqualFilter(field, maxValue)
                        : new expressions_1.LessThanFilter(field, maxValue));
                }
                if (filters.length === 0) {
                    throw new Error("Range expression must have at least one bound");
                }
                return filters.length === 1 ? filters[0] : new expressions_1.AndFilter(filters);
            });
            return result;
        });
        /**
         * One or more text/escaped tokens for range bound values.
         * The TO keyword is intentionally excluded so it acts as the separator.
         *
         * NOTE: CONSUME must remain at the top level of each ALT body (not inside
         * ACTION) so that Chevrotain can discover the FIRST sets during the
         * grammar recording phase.
         */
        this.rangeValueChunks = this.RULE("rangeValueChunks", () => {
            let text = "";
            this.AT_LEAST_ONE(() => {
                this.OR([
                    {
                        ALT: () => {
                            text += tokenValue(this.CONSUME(Text));
                        },
                    },
                    {
                        ALT: () => {
                            text += tokenValue(this.CONSUME(Escaped));
                        },
                    },
                ]);
            });
            return text;
        });
        /**
         * One or more text/escaped/TO tokens for wildcard and literal values.
         * TO is permitted as literal value text (e.g. "city=TO").
         *
         * NOTE: CONSUME must remain at the top level of each ALT body (not inside
         * ACTION) so that Chevrotain can discover the FIRST sets during the
         * grammar recording phase.
         */
        this.valueTextChunks = this.RULE("valueTextChunks", () => {
            let text = "";
            this.AT_LEAST_ONE(() => {
                this.OR([
                    {
                        ALT: () => {
                            text += tokenValue(this.CONSUME(Text));
                        },
                    },
                    {
                        ALT: () => {
                            text += tokenValue(this.CONSUME(Escaped));
                        },
                    },
                    {
                        ALT: () => {
                            text += this.CONSUME(TO).image;
                        },
                    },
                ]);
            });
            return text;
        });
        /**
         * One or more tokens forming a field name (Text, Escaped, or literal TO).
         *
         * NOTE: CONSUME must remain at the top level of each ALT body (not inside
         * ACTION) so that Chevrotain can discover the FIRST sets during the
         * grammar recording phase.
         */
        this.fieldNameRule = this.RULE("fieldNameRule", () => {
            let name = "";
            this.AT_LEAST_ONE(() => {
                this.OR([
                    {
                        ALT: () => {
                            name += tokenValue(this.CONSUME(Text));
                        },
                    },
                    {
                        ALT: () => {
                            name += tokenValue(this.CONSUME(Escaped));
                        },
                    },
                    {
                        ALT: () => {
                            name += this.CONSUME(TO).image;
                        },
                    },
                ]);
            });
            return name;
        });
        this.performSelfAnalysis();
    }
    // ---------------------------------------------------------------------------
    // Lookahead helpers
    // ---------------------------------------------------------------------------
    /**
     * Returns true when the upcoming tokens look like "fieldName =", i.e. at
     * least one Text/Escaped/TO token followed immediately by Equals.
     */
    isFieldAssignmentStart() {
        let i = 1;
        let tt = this.LA(i).tokenType;
        let hasFieldToken = false;
        while (tt === Text || tt === TO || tt === Escaped) {
            hasFieldToken = true;
            i++;
            tt = this.LA(i).tokenType;
        }
        return hasFieldToken && tt === Equals;
    }
    // ---------------------------------------------------------------------------
    // Result assembly
    // ---------------------------------------------------------------------------
    /**
     * Combines all accumulated parsedParts into a single IFilter:
     *   - consecutive parts sharing the same field are AND-ed within a group
     *   - groups are then combined with AND or OR per options.logic
     */
    buildResult() {
        var _a, _b;
        if (this.parsedParts.length === 0) {
            throw new Error("No filter parts parsed");
        }
        if (this.parsedParts.length === 1) {
            return this.parsedParts[0].filter;
        }
        // Group consecutive same-field parts.
        const groups = [];
        let currentGroup = null;
        for (const part of this.parsedParts) {
            if (currentGroup === null || part.field !== currentGroup.field) {
                if (currentGroup !== null) {
                    groups.push(currentGroup);
                }
                currentGroup = { filters: [part.filter], field: part.field };
            }
            else {
                currentGroup.filters.push(part.filter);
            }
        }
        if (currentGroup !== null) {
            groups.push(currentGroup);
        }
        // AND-combine filters within each group.
        const groupFilters = groups.map((g) => g.filters.length === 1 ? g.filters[0] : new expressions_1.AndFilter(g.filters));
        const isSameField = this.encounteredFields.size <= 1;
        const logic = (_b = (_a = this.currentOptions) === null || _a === void 0 ? void 0 : _a.logic) !== null && _b !== void 0 ? _b : filterOptions_1.FilterLogic.And;
        let result;
        if (isSameField || logic === filterOptions_1.FilterLogic.And) {
            result =
                groupFilters.length === 1
                    ? groupFilters[0]
                    : new expressions_1.AndFilter(groupFilters);
        }
        else if (groupFilters.length === 2) {
            result = new expressions_1.OrFilter(groupFilters[0], groupFilters[1]);
        }
        else {
            result = new expressions_1.OneOfFilter(groupFilters);
        }
        return result;
    }
    // ---------------------------------------------------------------------------
    // Public parsing entry point
    // ---------------------------------------------------------------------------
    /**
     * Reset all per-call state, lex the expression, run the parser and return
     * the assembled IFilter.  Throws on lexer or parser errors.
     */
    parseExpression(expression, options) {
        this.currentField = "";
        this.currentOptions = options;
        this.parsedParts = [];
        this.encounteredFields = new Set();
        const lexResult = FILTER_LEXER.tokenize(expression);
        if (lexResult.errors.length > 0) {
            throw new Error(`Lexer error at offset ${lexResult.errors[0].offset}: ${lexResult.errors[0].message}`);
        }
        this.input = lexResult.tokens;
        const result = this.filterInput();
        if (this.errors.length > 0) {
            throw new Error(`Parse error: ${this.errors[0].message}`);
        }
        return result;
    }
}
// Single shared instance — performSelfAnalysis is expensive and runs only once.
const PARSER_INSTANCE = new InternalFilterParser();
/**
 * Parse a DataFilters query string into an IFilter.
 *
 * @param expression - A filter expression string, e.g. "name=*bat*" or
 *   "name=*bat*&age=[18 TO *[".
 * @param options - Optional parsing options that control how multiple
 *   criteria from different fields are combined.
 * @returns An IFilter representing the parsed expression.
 * @throws {Error} If the expression cannot be parsed.
 */
function parse(expression, options) {
    if (!expression || !expression.trim()) {
        throw new Error("Expression must not be empty");
    }
    const trimmed = expression.trim();
    const normalized = normalizeExpression(trimmed);
    return PARSER_INSTANCE.parseExpression(normalized, options);
}
//# sourceMappingURL=parser.js.map