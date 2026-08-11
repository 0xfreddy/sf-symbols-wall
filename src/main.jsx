import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Check, Copy, Moon, Search, Sun, X } from "lucide-react";
import symbols from "./symbols.json";
import "./styles.css";

const filters = [
  { id: "all", label: "All" },
  { id: "fill", label: "Filled" },
  { id: "outline", label: "Outline" },
  { id: "circle", label: "Circle" },
  { id: "square", label: "Square" },
];

function matchesFilter(symbol, filter) {
  if (filter === "all") return true;
  if (filter === "fill") return symbol.name.includes(".fill");
  if (filter === "outline") return !symbol.name.includes(".fill");
  if (filter === "circle") return symbol.name.includes("circle");
  if (filter === "square") return symbol.name.includes("square");
  return true;
}

function categoryFor(name) {
  if (name.includes("arrow") || name.includes("chevron")) return "Navigation";
  if (name.includes("person") || name.includes("face")) return "People";
  if (name.includes("cloud") || name.includes("sun") || name.includes("moon")) return "Weather";
  if (name.includes("doc") || name.includes("folder") || name.includes("tray")) return "Files";
  if (name.includes("phone") || name.includes("message") || name.includes("bubble")) return "Communication";
  if (name.includes("chart") || name.includes("waveform")) return "Data";
  return "Symbols";
}

function App() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [copied, setCopied] = useState("");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const visibleSymbols = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return symbols
      .filter((symbol) => matchesFilter(symbol, filter))
      .filter((symbol) => !normalizedQuery || symbol.name.includes(normalizedQuery))
      .slice(0, 360);
  }, [filter, query]);

  async function copySymbolName(name) {
    try {
      await navigator.clipboard.writeText(name);
    } catch {
      const input = document.createElement("input");
      input.value = name;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }

    setCopied(name);
    window.setTimeout(() => setCopied(""), 1600);
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="SF Symbols Wall home">
          <span className="brand-mark">
            <span />
          </span>
          <span>Symbol Wall</span>
        </a>

        <div className="top-actions">
          <label className="search-control" aria-label="Search symbols">
            <Search size={18} strokeWidth={2.2} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value.toLowerCase())}
              placeholder="Search names"
            />
            {query ? (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
                <X size={16} />
              </button>
            ) : null}
          </label>

          <button
            className="icon-button"
            type="button"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle dark mode"
          >
            {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
          </button>
        </div>
      </header>

      <section className="hero" id="top">
        <p className="kicker">SF Symbols, lined up for copy-paste work.</p>
        <h1>
          A wall of <span>symbols.</span>
        </h1>
        <p className="lede">
          Search every bundled glyph from the reference set, tap a tile, and the SF Symbol name is
          copied to your clipboard.
        </p>
      </section>

      <section className="controls" aria-label="Symbol filters">
        <p>
          <strong>{visibleSymbols.length}</strong> visible <span>/</span> {symbols.length} symbols
        </p>
        <div className="filter-pills">
          {filters.map((item) => (
            <button
              className={filter === item.id ? "active" : ""}
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <section className="grid" aria-live="polite">
        {visibleSymbols.map((symbol) => (
          <button
            className="symbol-card"
            key={symbol.name}
            type="button"
            onClick={() => copySymbolName(symbol.name)}
            title={`Copy ${symbol.name}`}
          >
            <span className="glass-icon">
              <img
                src={theme === "dark" ? symbol.whiteSrc : symbol.src}
                alt=""
                loading="lazy"
                draggable="false"
              />
            </span>
            <span className="symbol-name">{symbol.name}</span>
            <span className="symbol-meta">{categoryFor(symbol.name)}</span>
          </button>
        ))}
      </section>

      <footer className="footnote">
        <p>
          Click any tile to copy its SF Symbol name. Glyph source derived from the public
          `andrewtavis/sf-symbols-online` reference set. Not affiliated with Apple.
        </p>
      </footer>

      {copied ? (
        <div className="toast" role="status">
          <Check size={17} />
          Copied <strong>{copied}</strong>
        </div>
      ) : null}
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
