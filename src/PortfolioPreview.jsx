import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Star, Award, Rocket, Moon, Sun, X } from "lucide-react";

/**
 * Fix: Close all JSX tags (snapshot cards were missing closers) and ensure
 * multiline strings use template literals. Added smoke tests.
 */

// ---------- UI Bits ----------
const Badge = ({ children }) => (
  <span className="text-xs border px-2 py-1 rounded-full bg-white/40 dark:bg-white/5 border-black/10 dark:border-white/10">
    {children}
  </span>
);

const Metric = ({ children }) => (
  <div className="text-sm px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-600/20">
    {children}
  </div>
);

// ---------- Modal ----------
const ProjectModal = ({ project, onClose }) => (
  <AnimatePresence>
    {project && (
      <motion.div
        className="fixed inset-0 z-50 grid place-items-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
        <motion.div
          role="dialog"
          aria-modal
          className="relative w-full max-w-3xl rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-2xl"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
        >
          <button
            onClick={onClose}
            className="absolute right-3 top-3 inline-flex items-center justify-center rounded-lg border border-black/10 dark:border-white/10 p-2 hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Close"
          >
            <X size={18} />
          </button>
          <h3 className="text-2xl font-semibold">{project.title}</h3>
          {project.subtitle && (
            <p className="mt-1 opacity-80">{project.subtitle}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {project.tech?.map((t, i) => (
              <Badge key={i}>{t}</Badge>
            ))}
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <h4 className="text-lg font-semibold">What is the problem statement?</h4>
              <p className="mt-1 leading-relaxed">{project.problem}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold">Why it is important</h4>
              <p className="mt-1 leading-relaxed">{project.importance}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold">How did I build the solution</h4>
              <p className="mt-1 leading-relaxed whitespace-pre-line">{project.build}</p>
            </div>
            {project.extra && (
              <div>
                <h4 className="text-lg font-semibold">Additional Info</h4>
                <p className="mt-1 leading-relaxed">{project.extra}</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ---------- Card ----------
const ProjectCard = ({ project, onClick }) => (
  <motion.button
    onClick={onClick}
    className="text-left w-full rounded-2xl p-6 border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 hover:shadow-xl hover:-translate-y-0.5 transition-all"
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.01 }}
  >
    <div className="flex items-center justify-between gap-3">
      <h3 className="text-xl font-semibold">{project.title}</h3>
      {project.featured && (
        <div className="flex items-center gap-1 text-amber-600 dark:text-amber-300 text-sm"><Star size={16} /> Featured</div>
      )}
    </div>
    {project.subtitle && (
      <p className="mt-1 text-sm opacity-80 leading-relaxed">{project.subtitle}</p>
    )}
    <div className="mt-3 flex flex-wrap gap-2">
      {project.tech.slice(0, 6).map((t, i) => (
        <Badge key={i}>{t}</Badge>
      ))}
    </div>
    <div className="mt-4 flex flex-wrap gap-2">
      {project.impact.slice(0, 3).map((m, i) => (
        <Metric key={i}>{m}</Metric>
      ))}
    </div>
    {project.metrics?.length ? (
      <div className="mt-3 flex flex-wrap gap-2">
        {project.metrics.slice(0, 4).map((m, i) => (
          <Badge key={i}>{m}</Badge>
        ))}
        {project.metrics.length > 4 && (
          <Metric>+{project.metrics.length - 4} more</Metric>
        )}
      </div>
    ) : null}
  </motion.button>
);

// ---------- Section Wrapper ----------
const Section = ({ id, title, icon, children, className = "" }) => (
  <section id={id} className={`py-12 md:py-16 ${className}`}>
    <div className="mx-auto max-w-7xl px-6">
      <div className="flex items-center gap-2 mb-6">
        {icon}
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
      </div>
      {children}
    </div>
  </section>
);

// ---------- Theme Toggle ----------
const ToggleTheme = () => {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);
  return (
    <button
      onClick={() => setDark((d) => !d)}
      className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/10 hover:shadow"
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
      {dark ? "Light" : "Dark"}
    </button>
  );
};

// ---------- Data ----------
const projectsData = [
  // GenAI projects
  {
    title: "BAT.AI",
    subtitle: "Agentic workflow for automated log analysis & bug filing",
    tech: ["Python", "LangGraph", "RAG", "SQL", "Milvus", "NVIDIA NIMs"],
    impact: ["90% dup detection", "1200+ person-days/yr saved", "20+ teams onboarded"],
    featured: true,
    problem:
      "Engineering teams spent significant time triaging logs and filing duplicate bugs, slowing delivery cycles.",
    importance:
      "Reducing triage time directly accelerates release cadence and improves developer experience across orgs.",
    build: `• Multi-agent pipeline: Ingest → Parse → Dedup → Classify → File
• Hybrid retrieval (semantic + BM25) + vector store (Milvus)
• Accuracy gates and evaluator for continuous quality`,
    extra:
      "Recognized for company-wide rollout; aligns with AI governance via measurable evaluation metrics.",
  },
  {
    title: "AI Code Review Assistant",
    subtitle: "LLM-enhanced CI pipelines to speed up PR reviews",
    tech: ["Python", "GitLab", "LLM", "LangChain"],
    impact: ["35% faster code reviews", "Higher code quality", "Multi-region rollout"],
    problem:
      "PR reviews were slow and inconsistent across teams, causing feedback bottlenecks.",
    importance:
      "Faster, consistent reviews reduce cycle time and defects escaping to production.",
    build: `• CI-integrated LLM checks for style, tests, and risk
• Auto-summaries + suggested fixes inside MR discussions`,
    extra:
      "Mentored devs to interpret AI feedback effectively; reduced reviewer burnout.",
  },
  {
    title: "Deep Learning Bug Deduplication",
    subtitle: "NLP-based duplicate bug detection at scale",
    tech: ["Python", "NLP", "DL"],
    impact: ["96.5% accuracy", "40% less manual triage"],
    problem:
      "Duplicate bug reports inflated backlog and wasted triage effort.",
    importance:
      "Lowering duplicate noise improves focus on real regressions and speeds up fixes.",
    build: `• Sentence embeddings + classifier tuned on historical data
• Thresholding and human-in-the-loop verification`,
    extra:
      "Served as precursor to agentic BAT.AI dedup step.",
  },
  {
    title: "RAG Evaluation Pipeline",
    subtitle: "Custom evaluation pipeline with quantitative LLM metrics",
    tech: ["Python", "Milvus", "LangChain", "Eval"],
    impact: ["40% faster AI decisions", "Objective quality gates"],
    problem:
      "Subjective evals made it hard to compare RAG designs and ship the best one confidently.",
    importance:
      "Objective metrics enable consistent architecture decisions and governance.",
    build: `• Metric suite implemented with batch harness & traces
• Retrieval: precision/recall@k, MRR; Generation: hallucination score, coherence score, relevance score
• Also tracked groundedness/attribution, answer completeness, latency & $ cost per query
• Automated HTML/CSV reports for stakeholders with regressions highlighted`,
    extra:
      "Metrics used: Hallucination • Coherence • Relevance • Groundedness/Attribution • Answer Completeness • Retrieval P/R@k • MRR • Latency • Cost per query. Results fed into CI quality gates for RAG changes.",
    metrics: [
      "Hallucination",
      "Coherence",
      "Relevance",
      "Groundedness",
      "Answer Completeness",
      "P/R@k",
      "MRR",
      "Latency",
      "Cost",
    ],
  },

  // New projects
  {
    title: "Spec–Drift Sentinel",
    subtitle: "Detects and flags requirement drift using PRD/SRD/SDD docs",
    tech: ["Python", "LangChain", "Embeddings"],
    impact: ["Reduced misalignment", "Early detection of spec drift"],
    problem:
      "Requirements and implementation often diverged over time, leading to costly rework.",
    importance:
      "Catching spec drift early saves engineering cycles and improves quality.",
    build: `• Parsed PRD/SRD/SDD documents
• Compared embeddings across versions
• Drift alerts integrated into workflow`,
    extra:
      "Improved cross-team alignment and reduced requirement-related bugs.",
  },
  {
    title: "Risk-Weighted Test Prioritizer",
    subtitle: "AI-driven prioritization of test cases based on risk factors",
    tech: ["Python", "LangChain", "MinIO"],
    impact: ["Higher defect catch rate", "Optimized test execution"],
    problem:
      "Teams lacked a systematic way to prioritize tests based on risk and impact.",
    importance:
      "Risk-based prioritization improves coverage where it matters most.",
    build: `• Risk scoring model
• Weighted prioritization algorithm
• Integrated into CI pipeline`,
    extra:
      "Resulted in faster feedback cycles with higher confidence.",
  },
  {
    title: "Bug Reproduction Agent",
    subtitle: "Turns bug reports into deterministic automated tests",
    tech: ["Python", "LLM", "Automation"],
    impact: ["Faster bug repro", "Linked repro tests in JIRA"],
    problem:
      "Manual bug reproduction was time-consuming and inconsistent.",
    importance:
      "Automated repro improves consistency and accelerates fix validation.",
    build: `• LLM parses bug text + logs
• Generates reproducible automated tests
• Tests linked back to JIRA issues`,
    extra:
      "Reduced QA workload and accelerated bug fix verification.",
  },
  {
    title: "Mutation-Driven Test Booster",
    subtitle: "Boosts test suite by injecting code mutations and checking coverage",
    tech: ["Python", "Mutation Testing", "LangChain"],
    impact: ["Improved coverage", "Found weak tests"],
    problem:
      "Tests often passed but failed to catch regressions.",
    importance:
      "Mutation-driven testing strengthens the suite by ensuring tests fail when expected.",
    build: `• Injected controlled mutations
• Measured test suite sensitivity
• Suggested new test cases`,
    extra:
      "Raised confidence in critical code paths.",
  },
  {
    title: "QA Knowledge Graph + RAG Assistant",
    subtitle: "Knowledge graph and RAG for QA domain knowledge and answers",
    tech: ["Python", "Knowledge Graph", "RAG"],
    impact: ["Faster QA onboarding", "Improved issue resolution"],
    problem:
      "QA teams lacked centralized knowledge, slowing onboarding and troubleshooting.",
    importance:
      "Centralized knowledge improves speed and accuracy across QA.",
    build: `• Built QA knowledge graph
• RAG assistant to query docs
• Integrated into team workflow`,
    extra:
      "Improved knowledge sharing and reduced repeated queries.",
  },
];

// ---------- Tests (console) ----------
function runSmokeTests() {
  const titles = projectsData.map((p) => p.title);
  const hasAlfred = titles.some((t) => /alfred chatbot/i.test(t));
  const rag = projectsData.find((p) => /RAG Evaluation Pipeline/i.test(p.title));
  const required = projectsData.map((p) => ({
    title: p.title,
    hasProblem: !!p.problem,
    hasImportance: !!p.importance,
    hasBuild: !!p.build,
  }));
  // eslint-disable-next-line no-console
  console.table(required);
  // eslint-disable-next-line no-console
  console.log(
    "No 'Alfred Chatbot' present:", !hasAlfred ? "PASS" : "FAIL"
  );
  // eslint-disable-next-line no-console
  console.log(
    "RAG metrics present:", rag?.metrics?.includes("Hallucination") && rag.metrics.length >= 5 ? "PASS" : "FAIL"
  );
}

export default function PortfolioPreview() {
  const year = useMemo(() => new Date().getFullYear(), []);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    runSmokeTests();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-100">
      {/* Nav */}
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/40 border-b border-black/5 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
          <div className="font-semibold tracking-tight">Prashant Bhende</div>
          <div className="flex items-center gap-3">
            <a href="#projects" className="text-sm hover:opacity-80">Projects</a>
            <a href="#about" className="text-sm hover:opacity-80">About</a>
            <a href="#contact" className="text-sm hover:opacity-80">Contact</a>
            <ToggleTheme />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-8 items-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              Engineering Manager (AI & Automation)
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">
                Agentic systems • RAG • Developer Experience
              </span>
            </h1>
            <p className="mt-4 text-base md:text-lg opacity-90 leading-relaxed">
              I build GenAI platforms that remove friction so developers can focus on what they do best—building great software.
              1200+ person-days saved yearly, 20+ teams onboarded, and measurable gains across code quality and cycle time.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#projects" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">
                <Rocket size={16} /> See Projects
              </a>
              <a href="#contact" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-black/10 dark:border-white/10 hover:shadow">
                <Mail size={16} /> Contact
              </a>
            </div>
            <div className="mt-6 flex items-center gap-4 text-sm">
              <div className="inline-flex items-center gap-1"><Award size={16} /> 6× Top Contributor</div>
              <div className="inline-flex items-center gap-1"><Star size={16} /> Patent Filed</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-black/10 dark:border-white/10 p-6 bg-white/60 dark:bg-white/5"
          >
            <div className="text-sm uppercase tracking-wide opacity-70 mb-3">Snapshot</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl p-4 bg-emerald-500/10 border border-emerald-600/20">
                <div className="text-2xl font-semibold">90%</div>
                <div className="text-sm opacity-80">Dup-bug detection</div>
              </div>
              <div className="rounded-xl p-4 bg-cyan-500/10 border border-cyan-600/20">
                <div className="text-2xl font-semibold">1200+</div>
                <div className="text-sm opacity-80">Person-days saved/yr</div>
              </div>
              <div className="rounded-xl p-4 bg-fuchsia-500/10 border border-fuchsia-600/20">
                <div className="text-2xl font-semibold">20+</div>
                <div className="text-sm opacity-80">Teams onboarded</div>
              </div>
              <div className="rounded-xl p-4 bg-amber-500/10 border border-amber-600/20">
                <div className="text-2xl font-semibold">3×</div>
                <div className="text-sm opacity-80">Cycle acceleration</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects */}
      <Section id="projects" title="GenAI Projects" icon={<Rocket className="text-emerald-600 dark:text-emerald-400" />}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsData.map((p, i) => (
            <ProjectCard project={p} key={i} onClick={() => setSelected(p)} />
          ))}
        </div>
      </Section>

      {/* About */}
      <Section id="about" title="About" icon={<Award className="text-emerald-600 dark:text-emerald-400" />} className="bg-slate-100/60 dark:bg-white/5">
        <div className="max-w-3xl text-lg leading-relaxed">
          <p>
            I lead cross-functional teams to design and deploy AI systems that measurably improve developer experience: agentic multi-agent platforms, RAG pipelines, and AI-assisted quality gates.
            I enjoy mentoring engineers and building in-house AI expertise.
          </p>
        </div>
      </Section>

      {/* Contact */}
      <Section id="contact" title="Get in touch" icon={<Mail className="text-emerald-600 dark:text-emerald-400" />}>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <a
            href="mailto:prashant.bhende02@gmail.com"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-black/10 dark:border-white/10 hover:shadow"
          >
            <Mail size={16} /> prashant.bhende02@gmail.com
          </a>
        </div>
      </Section>

      <footer className="py-8 border-t border-black/5 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-6 text-sm opacity-70">© {year} Prashant Bhende • Portfolio preview</div>
      </footer>

      {/* Modal mount */}
      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </div>
  );
}