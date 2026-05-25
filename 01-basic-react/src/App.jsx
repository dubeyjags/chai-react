
function App() {
  return (
    <div
      style={{
        background: "var(--bg)",
        color: "var(--text)",
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "var(--font-sans)",
      }}
    >
      <h1 style={{ color: "var(--text-h)" }}>Hello</h1>

      {/* colour swatches — shows the theme tokens */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
        {[
          ["--bg",           "bg"],
          ["--bg-secondary", "bg-secondary"],
          ["--primary",      "primary"],
          ["--secondary",    "secondary"],
          ["--text-h",       "text-h"],
          ["--text",         "text"],
        ].map(([token, label]) => (
          <div key={token} style={{ textAlign: "center" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "var(--radius)",
                background: `var(${token})`,
                border: "1px solid var(--border)",
              }}
            />
            <span style={{ fontSize: "0.75rem", color: "var(--text-h)" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
