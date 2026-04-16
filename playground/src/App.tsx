import { useMemo, useState } from "react";
import { FilterLogic, FilterOptions, parse, toJson } from "datafilters";
import "./App.css";

const SAMPLE_EXPRESSIONS = [
  "name=*bat*",
  "name=*bat*&age=[18 TO *[",
  "status=active|pending",
  "country=FR&city=Paris",
];

const SYNTAX_HINTS = [
  {
    label: "Equals",
    expression: "name=Batman",
    tooltip: "Matches an exact value on one field using field=value.",
  },
  {
    label: "Contains",
    expression: "name=*bat*",
    tooltip: "Wrap the value in *...* to match a substring anywhere in the field.",
  },
  {
    label: "Starts with",
    expression: "name=Bat*",
    tooltip: "Add a trailing * to match values that start with the given prefix.",
  },
  {
    label: "Ends with",
    expression: "name=*man",
    tooltip: "Add a leading * to match values that end with the given suffix.",
  },
  {
    label: "Not equal",
    expression: "name=!Batman",
    tooltip: "Prefix the value with ! to negate a single expression.",
  },
  {
    label: "Range inclusive",
    expression: "age=[18 TO 65]",
    tooltip: "Use [min TO max] for inclusive lower and upper bounds.",
  },
  {
    label: "Range exclusive",
    expression: "age=]18 TO 65[",
    tooltip: "Use ]min TO max[ when both bounds should be exclusive.",
  },
  {
    label: ">= only",
    expression: "age=[18 TO *[",
    tooltip: "Use [min TO *[ for an inclusive lower bound with no upper bound.",
  },
  {
    label: "<= only",
    expression: "age=]* TO 65]",
    tooltip: "Use ]* TO max] for an inclusive upper bound with no lower bound.",
  },
  {
    label: "Same field AND",
    expression: "name=*bat*,*man",
    tooltip: "Separate expressions with a comma to chain constraints on the same field.",
  },
  {
    label: "Alternatives",
    expression: "status=active|pending",
    tooltip: "Use | to express alternatives for the current field.",
  },
  {
    label: "Multiple fields",
    expression: "country=FR&city=Paris",
    tooltip: "Use & between different fields. The select below controls whether those fields are combined as and or or.",
  },
  {
    label: "Escaped symbols",
    expression: "name=Bat\\*man",
    tooltip: "Escape reserved characters like *, |, , and & with a backslash when they should stay literal.",
  },
] as const;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function App() {
  const [expression, setExpression] = useState("name=*bat*&age=[18 TO *[");
  const [logic, setLogic] = useState<FilterLogic>(FilterLogic.And);
  const [resultJson, setResultJson] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [lastActionAt, setLastActionAt] = useState("");

  const options = useMemo(() => new FilterOptions({ logic }), [logic]);

  const runParse = () => {
    try {
      const parsed = parse(expression, options);
      const json = toJson(parsed, 2);

      setResultJson(json);
      setErrorMessage("");
      setLastActionAt(new Date().toLocaleTimeString());
    } catch (error) {
      setResultJson("");
      setErrorMessage(getErrorMessage(error));
      setLastActionAt(new Date().toLocaleTimeString());
    }
  };

  return (
    <main className="page">
      <section className="panel editor-panel">
        <header className="panel-header">
          <p className="eyebrow">DataFilters Playground</p>
          <h1>Test your filter expression</h1>
          <p className="hint">
            Enter an expression, pick the default logic used between fields,
            then parse to inspect the JSON payload.
          </p>
        </header>

        <label htmlFor="expression-input" className="field-label">
          Expression
        </label>
        <textarea
          id="expression-input"
          className="editor"
          value={expression}
          onChange={(event) => setExpression(event.target.value)}
          placeholder="name=*bat*&age=[18 TO *["
          spellCheck={false}
        />

        <section className="syntax-guide" aria-labelledby="syntax-guide-title">
          <div className="syntax-guide-header">
            <div>
              <p id="syntax-guide-title" className="field-label compact">
                Query syntax guide
              </p>
              <p className="syntax-guide-copy">
                Click an example to load it into the editor. Hover or focus the
                question mark to view the syntax rule behind it.
              </p>
            </div>
          </div>

          <div className="syntax-grid">
            {SYNTAX_HINTS.map((hint) => (
              <div key={hint.label} className="syntax-item">
                <button
                  type="button"
                  className="syntax-chip"
                  onClick={() => setExpression(hint.expression)}
                >
                  <span className="syntax-chip-label">{hint.label}</span>
                  <code>{hint.expression}</code>
                </button>

                <span className="tooltip-wrap">
                  <button
                    type="button"
                    className="tooltip-trigger"
                    aria-label={`Show help for ${hint.label}`}
                  >
                    ?
                  </button>
                  <span className="tooltip-bubble" role="tooltip">
                    {hint.tooltip}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </section>

        <div className="toolbar">
          <label htmlFor="logic-select" className="field-label compact">
            Default logic
          </label>
          <select
            id="logic-select"
            value={logic}
            onChange={(event) => setLogic(event.target.value as FilterLogic)}
            aria-describedby="logic-help"
          >
            <option value={FilterLogic.And}>and</option>
            <option value={FilterLogic.Or}>or</option>
          </select>

          <span id="logic-help" className="toolbar-help">
            Applied only when the query contains different fields joined with &.
          </span>

          <button type="button" onClick={runParse}>
            Parse
          </button>
        </div>

        <div className="chips">
          {SAMPLE_EXPRESSIONS.map((sample) => (
            <button
              key={sample}
              type="button"
              className="chip"
              onClick={() => setExpression(sample)}
            >
              {sample}
            </button>
          ))}
        </div>

        <p className="meta">
          Last action: {lastActionAt || "none"} | API: parse(expression,
          options) + toJson(filter)
        </p>
      </section>

      <section className="results-grid" aria-live="polite">
        <article className="panel output-panel">
          <h2>Result JSON</h2>
          {resultJson ? (
            <pre>{resultJson}</pre>
          ) : (
            <p className="empty">No successful parse yet.</p>
          )}
        </article>

        <article className="panel error-panel">
          <h2>Parse error</h2>
          {errorMessage ? (
            <pre>{errorMessage}</pre>
          ) : (
            <p className="empty">No error.</p>
          )}
        </article>
      </section>
    </main>
  );
}

export default App;
