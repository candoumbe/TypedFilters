import { useMemo, useState } from "react";
import { FilterLogic, FilterOptions, parse, toJson } from "datafilters";
import "./App.css";

const SAMPLE_EXPRESSIONS = [
  "name=*bat*",
  "name=*bat*&age=[18 TO *[",
  "status=active|pending",
  "country=FR&city=Paris",
];

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

        <div className="toolbar">
          <label htmlFor="logic-select" className="field-label compact">
            Default logic
          </label>
          <select
            id="logic-select"
            value={logic}
            onChange={(event) => setLogic(event.target.value as FilterLogic)}
          >
            <option value={FilterLogic.And}>and</option>
            <option value={FilterLogic.Or}>or</option>
          </select>

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
