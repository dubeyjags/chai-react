import { Link } from "react-router-dom";

const projects = [
  {
    title: "Background Changer",
    description: "Instantly switch the page background between 8 vivid colors with a single click.",
    path: "/bg-changer",
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    accent: "from-pink-500 to-rose-500",
    badge: "UI / State",
    features: ["8 color presets", "Instant live preview", "useState hook"],
  },
  {
    title: "Password Generator",
    description: "Generate strong, random passwords with configurable length, numbers, and symbols.",
    path: "/password-generator",
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    accent: "from-indigo-500 to-violet-500",
    badge: "Hooks",
    features: ["Length 6 – 40 chars", "Numbers & symbols toggle", "One-click copy"],
  },
  {
    title: "Currency Converter",
    description: "Convert between world currencies using real-time exchange rates fetched from an open API.",
    path: "/currency-convertor",
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    accent: "from-blue-500 to-cyan-500",
    badge: "Custom Hook",
    features: ["Live exchange rates", "Swap currencies", "Custom useCurrencyInfo hook"],
  },
  {
    title: "Todo Manager",
    description: "A full-featured todo app with add, edit, delete, and completion toggle — persisted in localStorage.",
    path: "/todos",
    icon: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    accent: "from-emerald-500 to-teal-500",
    badge: "Context API",
    features: ["Add / edit / delete todos", "Toggle completion", "localStorage persistence"],
  },
  {
    title: "GitHub Profile",
    description: "Fetch and display any GitHub user's profile card — repos, followers, and bio — using React Router's loader.",
    path: "/github",
    icon: (
      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.216.69.825.573C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
    accent: "from-slate-600 to-gray-800",
    badge: "useLoaderData",
    features: ["GitHub REST API", "React Router loader", "Repos / followers stats"],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg)] px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-14">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-h)] tracking-tight mb-3">
          React Mini Projects
        </h1>
        <p className="text-[var(--text)] text-base sm:text-lg max-w-xl mx-auto">
          A collection of small, focused React apps built to practise useState, useContext, custom hooks, React Router loaders, and localStorage — all styled with Tailwind CSS.
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 mx-auto">
        {projects.map(({ title, description, path, icon, accent, badge, features }) => (
          <div
            key={path}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 flex flex-col shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200"
          >
            {/* Icon + badge row */}
            <div className="flex items-center justify-between mb-4">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${accent} shadow-lg`}>
                {icon}
              </div>
              <span className="text-xs font-semibold text-[var(--text)] bg-[var(--bg)] px-2.5 py-1 rounded-full">
                {badge}
              </span>
            </div>

            {/* Title & description */}
            <h2 className="text-lg font-bold text-[var(--text-h)] mb-2">{title}</h2>
            <p className="text-[var(--text)] text-sm leading-relaxed mb-4">{description}</p>

            {/* Feature list */}
            <ul className="space-y-1.5 mb-6 flex-1">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-[var(--text)] text-xs">
                  <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${accent} flex-shrink-0`} />
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              to={path}
              className={`w-full text-center py-2.5 rounded-xl text-white text-sm font-semibold bg-gradient-to-r ${accent} hover:opacity-90 active:opacity-75 transition-opacity duration-150 shadow-md`}
            >
              Open →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
