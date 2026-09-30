"use client";

import { useMemo, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

type Repo = {
  owner: string;
  name: string;
};

const activity = [
  { day: "Mon", commits: 12 },
  { day: "Tue", commits: 18 },
  { day: "Wed", commits: 9 },
  { day: "Thu", commits: 24 },
  { day: "Fri", commits: 31 },
  { day: "Sat", commits: 14 },
  { day: "Sun", commits: 7 }
];

const languages = [
  { name: "TypeScript", value: 48 },
  { name: "JavaScript", value: 27 },
  { name: "CSS", value: 16 },
  { name: "Other", value: 9 }
];

function parseRepo(url: string): Repo | null {
  const clean = url.trim().replace(/\/+$/, "");
  const match = clean.match(/github\.com\/([^/]+)\/([^/#?]+)/i);
  if (!match) return null;
  return { owner: match[1], name: match[2].replace(/\.git$/, "") };
}

export default function CommitLens() {
  const [url, setUrl] = useState("");
  const [repo, setRepo] = useState<Repo | null>(null);
  const [error, setError] = useState("");

  const displayName = useMemo(
    () => repo ? `${repo.owner}/${repo.name}` : "Repository",
    [repo]
  );

  function analyze() {
    const parsed = parseRepo(url);
    if (!parsed) {
      setError("Enter a valid GitHub repository URL.");
      return;
    }
    setError("");
    setRepo(parsed);
  }

  return (
    <main className="shell">
      <nav className="nav">
        <div className="brand"><span className="brandMark">C</span> CommitLens</div>
        <div className="navLinks">
          <a href="#dashboard">Dashboard</a>
          <a href="#about">About</a>
          <a href="https://github.com" target="_blank">GitHub</a>
        </div>
      </nav>

      <section className="hero">
        <div className="eyebrow">GITHUB REPOSITORY ANALYTICS</div>
        <h1>See how your<br /><span>code evolves.</span></h1>
        <p>Turn Git history into a clean, useful development report.</p>

        <div className="searchBox">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && analyze()}
            placeholder="https://github.com/username/repository"
          />
          <button onClick={analyze}>Analyze</button>
        </div>
        {error && <div className="error">{error}</div>}
      </section>

      {repo && (
        <section id="dashboard" className="dashboard">
          <div className="repoHeader">
            <div>
              <div className="muted">ANALYZING REPOSITORY</div>
              <h2>{displayName}</h2>
            </div>
            <span className="status">● LIVE PREVIEW</span>
          </div>

          <div className="stats">
            <Stat label="TOTAL COMMITS" value="247" />
            <Stat label="CONTRIBUTORS" value="3" />
            <Stat label="ACTIVE DAYS" value="81" />
            <Stat label="CURRENT STREAK" value="12d" />
          </div>

          <div className="grid">
            <Panel title="Commit Activity" wide>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={activity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis dataKey="day" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip contentStyle={{ background: "#111", border: "1px solid #292929" }} />
                  <Area type="monotone" dataKey="commits" stroke="#ff6a00" fill="#ff6a00" fillOpacity={0.13} />
                </AreaChart>
              </ResponsiveContainer>
            </Panel>

            <Panel title="Languages">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={languages} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis type="number" stroke="#666" />
                  <YAxis dataKey="name" type="category" stroke="#888" width={80} />
                  <Tooltip contentStyle={{ background: "#111", border: "1px solid #292929" }} />
                  <Bar dataKey="value" fill="#ff6a00" radius={[0, 5, 5, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Panel>

            <Panel title="Development Timeline">
              <div className="timeline">
                <Timeline date="MAY 2026" text="Repository created" />
                <Timeline date="JUN 2026" text="Core architecture built" />
                <Timeline date="AUG 2026" text="Major feature sprint" />
                <Timeline date="SEP 2026" text="Current development" />
              </div>
            </Panel>

            <Panel title="Repository Signals" wide>
              <div className="signals">
                <Signal label="Development velocity" value="High" />
                <Signal label="Commit consistency" value="Strong" />
                <Signal label="Weekend activity" value="14%" />
                <Signal label="Primary language" value="TypeScript" />
              </div>
            </Panel>
          </div>
        </section>
      )}

      {!repo && (
        <section className="preview">
          <div className="previewCard"><strong>247</strong><span>commits</span></div>
          <div className="previewCard"><strong>81</strong><span>active days</span></div>
          <div className="previewCard"><strong>12d</strong><span>streak</span></div>
          <div className="previewCard"><strong>3</strong><span>contributors</span></div>
        </section>
      )}

      <footer id="about">
        <span>CommitLens v1.0</span>
        <span>Built for developers.</span>
      </footer>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="stat"><div className="muted">{label}</div><strong>{value}</strong></div>;
}

function Panel({ title, children, wide = false }: { title: string; children: React.ReactNode; wide?: boolean }) {
  return <div className={`panel ${wide ? "wide" : ""}`}><div className="panelTitle">{title}</div>{children}</div>;
}

function Timeline({ date, text }: { date: string; text: string }) {
  return <div className="timelineItem"><span>{date}</span><b>{text}</b></div>;
}

function Signal({ label, value }: { label: string; value: string }) {
  return <div className="signal"><span>{label}</span><b>{value}</b></div>;
}