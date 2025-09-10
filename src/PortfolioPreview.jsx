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
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
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
          className="relative w-full max-w-3xl max-h-[90vh] rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
        >
          <div className="flex-shrink-0 p-6 border-b border-black/10 dark:border-white/10">
            <button
              onClick={onClose}
              className="absolute right-3 top-3 inline-flex items-center justify-center rounded-lg border border-black/10 dark:border-white/10 p-2 hover:bg-black/5 dark:hover:bg-white/5"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <h3 className="text-2xl font-semibold pr-12">{project.title}</h3>
            {project.subtitle && (
              <p className="mt-1 opacity-80">{project.subtitle}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {project.tech?.map((t, i) => (
                <Badge key={i}>{t}</Badge>
              ))}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-5">
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
                <p className="mt-1 leading-relaxed whitespace-pre-line" dangerouslySetInnerHTML={{ __html: project.build }}></p>
              </div>
              {project.extra && (
                <div>
                  <h4 className="text-lg font-semibold">Additional Info</h4>
                  <p className="mt-1 leading-relaxed">{project.extra}</p>
                </div>
              )}
            </div>
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
    title: "Multi-AI Agent Self Corrective RAG for Log Analysis",
    subtitle: "Agentic workflow for automated log analysis & bug filing",
    tech: ["Python", "LangGraph", "RAG", "SQL", "Milvus", "NVIDIA NIMs"],
    impact: ["90% dup detection", "1200+ person-days/yr saved", "20+ teams onboarded"],
    featured: true,
    problem:
      "Engineering teams spend a huge amount of time analyzing logs, identifying issues, and manually drafting bug reports. This not only eats into productivity but also delays defect detection, slows down releases, and increases the risk of duplicate or poor-quality bug reports.",
    importance:
      "Manual bug analysis is repetitive, error-prone, and scales poorly as products grow. A single missed or poorly documented bug can create downstream costs in testing, development, and customer satisfaction. Automating this process with AI saves thousands of engineering hours, improves accuracy, and ensures consistency across teams.",
    build: `I designed and led the development of BAT.AI, an agentic multi-AI workflow that:
          • Analyzes logs and categorizes failures automatically.
          • Drafts high-quality bug reports with consistent formatting.
          • Detects duplicate bugs with over 90% accuracy.
          • Supports multi-product modules with tailored classification agents.
          • Provides explainable outputs and benchmarking via an RAG evaluation pipeline.
          • Uses a self-corrective RAG mechanism—agents iteratively refine retrieval results to minimize hallucinations, improve trace coverage, and ensure bug reports are factually grounded.`,
    extra:
      "Recognized for company-wide rollout; aligns with AI governance via measurable evaluation metrics.",
  },
  {
    title: "AI Code Review Assistant",
    subtitle: "LLM-enhanced CI pipelines to speed up PR reviews",
    tech: ["Python", "GitLab", "LLM", "LangChain"],
    impact: ["35% faster code reviews", "Higher code quality", "Multi-region rollout"],
    problem:
      "Code reviews were becoming a major bottleneck in our development pipeline. Senior engineers were spending 20-30% of their time reviewing PRs, leading to delayed releases and reviewer fatigue. Inconsistent review quality across teams meant some critical issues were missed while trivial style issues consumed disproportionate attention.",
    importance:
      "Code reviews are critical for maintaining quality, but manual reviews don't scale with growing teams and codebases. Automating routine checks allows human reviewers to focus on architecture, logic, and business requirements—the areas where human expertise truly matters. This directly impacts delivery velocity and product quality.",
    build: `I built an intelligent code review assistant that integrates seamlessly into GitLab CI/CD:
          • Automated analysis of code changes for style violations, security risks, and test coverage gaps.
          • Generated contextual summaries of PR changes with risk assessments and suggested improvements.
          • Implemented smart filtering to highlight only the most critical issues requiring human attention.
          • Created custom LLM prompts tuned for different code types (API changes, UI components, database migrations).
          • Built feedback loops to continuously improve AI suggestions based on reviewer acceptance rates.`,
    extra:
      "Mentored developers on interpreting AI feedback effectively and established best practices for human-AI collaboration in code reviews.",
  },
  {
    title: "Deep Learning Bug Deduplication",
    subtitle: "NLP-based duplicate bug detection at scale",
    tech: ["Python", "NLP", "DL"],
    impact: ["96.5% accuracy", "40% less manual triage"],
    problem:
      "Our bug tracking system was flooded with duplicate reports—sometimes the same issue would be filed 10+ times by different teams or customers. Manual deduplication required engineers to read through hundreds of similar-sounding bug titles and descriptions, consuming valuable triage time and creating inconsistent decisions about what constituted a 'duplicate.'",
    importance:
      "Duplicate bugs create noise that obscures real issues, inflate metrics, and waste engineering cycles. When teams can't quickly identify if a bug is already known, they either spend time investigating resolved issues or miss critical patterns across similar reports. Accurate deduplication is essential for maintaining clean backlogs and enabling data-driven prioritization.",
    build: `I developed a sophisticated NLP-based deduplication system using deep learning:
          • Engineered a multi-stage pipeline combining semantic similarity with metadata matching.
          • Fine-tuned sentence transformers on our domain-specific bug corpus to capture technical nuances.
          • Built ensemble models combining BERT embeddings, TF-IDF features, and structured data (product, severity, components).
          • Implemented confidence scoring with human-in-the-loop verification for edge cases.
          • Created automated clustering to identify bug patterns and potential root causes.`,
    extra:
      "This system became the foundation for the deduplication component in BAT.AI, proving that focused ML solutions can evolve into comprehensive agentic workflows.",
  },
  {
    title: "RAG Evaluation Pipeline",
    subtitle: "Custom evaluation pipeline with quantitative LLM metrics",
    tech: ["Python", "Milvus", "LangChain", "Eval"],
    impact: ["40% faster AI decisions", "Objective quality gates"],
    problem:
      "As our RAG systems grew in complexity, we faced a critical challenge: how do you objectively measure if one RAG configuration is better than another? Teams were making architectural decisions based on gut feeling or cherry-picked examples. Without standardized evaluation, we couldn't confidently deploy changes, compare different embedding models, or optimize retrieval strategies.",
    importance:
      "RAG systems directly impact user experience and business outcomes. Poor retrieval leads to irrelevant answers, while hallucinations can erode trust in AI systems. Objective evaluation enables data-driven decisions, prevents regressions, and provides the foundation for AI governance. It's the difference between shipping AI systems that work versus AI systems that work reliably.",
    build: `I designed and implemented a comprehensive RAG evaluation framework that became the gold standard for AI quality assessment:
          • Built automated evaluation harnesses that run against every code change, preventing regressions.
          • Implemented multi-dimensional metrics covering retrieval quality (precision/recall@k, MRR), generation quality (hallucination, coherence, relevance), and operational concerns (latency, cost).
          • Created synthetic and real-world test datasets with ground truth annotations for consistent benchmarking.
          • Developed automated report generation with regression detection and performance trending.
          • Integrated evaluation gates into CI/CD pipelines, blocking deployments that don't meet quality thresholds.`,
    extra:
      "This evaluation framework became the foundation for all RAG projects at the company, enabling confident iteration and serving as a model for AI governance best practices.",
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
      "Product requirements documents (PRDs), system requirements documents (SRDs), and system design documents (SDDs) were constantly evolving, but teams often worked from outdated versions. Critical requirement changes were buried in document revisions, leading to features being built against obsolete specs. By the time misalignment was discovered, significant engineering effort had been wasted on the wrong implementation.",
    importance:
      "Requirement drift is one of the most expensive problems in software development. When implementation diverges from current requirements, it leads to rework, missed deadlines, and products that don't meet stakeholder needs. Early detection of spec changes allows teams to adjust course before significant resources are invested in the wrong direction.",
    build: `I built an intelligent document monitoring system that tracks requirement evolution:
          • Developed automated parsing for PRD/SRD/SDD documents across multiple formats and repositories.
          • Implemented semantic change detection using embeddings to identify meaningful requirement shifts beyond simple text changes.
          • Created intelligent alerting that distinguishes between minor edits and significant requirement modifications.
          • Built cross-document consistency checking to flag conflicting requirements across related documents.
          • Integrated with project management tools to automatically notify affected teams and update tracking systems.`,
    extra:
      "This system became essential for maintaining alignment across distributed teams working on complex, multi-component products.",
  },
  {
    title: "Risk-Weighted Test Prioritizer",
    subtitle: "AI-driven prioritization of test cases based on risk factors",
    tech: ["Python", "LangChain", "MinIO"],
    impact: ["Higher defect catch rate", "Optimized test execution"],
    problem:
      "With thousands of test cases and limited CI/CD time budgets, teams were running tests in arbitrary order or simply executing everything—leading to long feedback cycles and delayed deployments. Critical functionality might not be tested until hours into a test run, while low-risk edge cases consumed valuable early slots. When time constraints forced test suite truncation, teams had no principled way to decide which tests to skip.",
    importance:
      "Test execution time directly impacts developer productivity and release velocity. Smart prioritization ensures that the most critical and risk-prone areas are validated first, providing faster feedback on likely failure points. This approach maximizes defect detection within time constraints while maintaining confidence in releases.",
    build: `I developed an intelligent test prioritization system that revolutionized our testing strategy:
          • Built a multi-factor risk scoring model considering code complexity, change frequency, historical failure rates, and business impact.
          • Implemented machine learning algorithms that learn from past test results to predict failure likelihood.
          • Created dynamic prioritization that adapts based on recent code changes, focusing testing effort on modified and related components.
          • Integrated with CI/CD pipelines to automatically reorder test execution based on real-time risk assessment.
          • Developed analytics dashboards showing test effectiveness and risk coverage metrics.`,
    extra:
      "This system enabled teams to catch critical issues 60% faster while reducing overall test execution time through intelligent test selection.",
  },
  {
    title: "Bug Reproduction Agent",
    subtitle: "Turns bug reports into deterministic automated tests",
    tech: ["Python", "LLM", "Automation"],
    impact: ["Faster bug repro", "Linked repro tests in JIRA"],
    problem:
      "Bug reproduction was a major bottleneck in our development process. Engineers would spend hours trying to recreate issues from vague bug reports, often failing to reproduce the exact conditions that triggered the problem. This led to bugs being marked as 'cannot reproduce' and later resurfacing in production. The manual nature of reproduction also meant that fixes couldn't be reliably validated.",
    importance:
      "Reliable bug reproduction is essential for effective debugging and fix validation. Without consistent reproduction, engineers waste time on guesswork, fixes may not address the root cause, and regressions can slip through testing. Automated reproduction creates a reliable foundation for both debugging and regression prevention.",
    build: `I created an intelligent agent that transforms bug reports into executable test cases:
          • Built natural language processing capabilities to extract key information from bug descriptions, including steps to reproduce, expected vs. actual behavior, and environmental conditions.
          • Developed automated test generation that creates deterministic reproduction scripts from parsed bug information.
          • Implemented integration with existing test frameworks to ensure generated tests follow established patterns and can be maintained by the team.
          • Created bidirectional linking between JIRA issues and generated tests, providing traceability and enabling automatic test execution on related code changes.
          • Built validation mechanisms to verify that generated tests actually reproduce the reported behavior.`,
    extra:
      "This system transformed bug investigation from a time-consuming manual process into an automated workflow, enabling faster debugging and more reliable fix validation.",
  },
  {
    title: "Mutation-Driven Test Booster",
    subtitle: "Boosts test suite by injecting code mutations and checking coverage",
    tech: ["Python", "Mutation Testing", "LangChain"],
    impact: ["Improved coverage", "Found weak tests"],
    problem:
      "High code coverage metrics were giving teams false confidence in their test suites. Tests would pass consistently, but when real bugs were introduced, the same tests would continue to pass, missing critical regressions. Traditional coverage metrics measured which lines were executed but not whether tests could actually detect problems in those lines.",
    importance:
      "Test quality is more important than test quantity. A comprehensive test suite that can't detect bugs provides a dangerous illusion of safety. Mutation testing reveals the true effectiveness of tests by measuring their ability to catch intentional code changes, ensuring that your test suite will catch real regressions.",
    build: `I developed a comprehensive mutation testing system that revolutionized our approach to test quality:
          • Built automated mutation injection that systematically introduces controlled bugs into the codebase (changing operators, modifying conditions, altering constants).
          • Created intelligent mutation selection focusing on high-risk code paths and recent changes rather than exhaustive mutation.
          • Implemented test suite analysis to identify which tests kill which mutations, revealing gaps in test effectiveness.
          • Developed AI-powered suggestions for new test cases targeting uncaught mutations, using LLMs to generate meaningful test scenarios.
          • Built reporting dashboards that translate mutation scores into actionable insights for development teams.`,
    extra:
      "This system helped teams move beyond coverage theater to actual test effectiveness, significantly improving the reliability of their safety nets.",
  },
  {
    title: "QA Knowledge Graph + RAG Assistant",
    subtitle: "Knowledge graph and RAG for QA domain knowledge and answers",
    tech: ["Python", "Knowledge Graph", "RAG"],
    impact: ["Faster QA onboarding", "Improved issue resolution"],
    problem:
      "QA domain knowledge was scattered across wikis, Slack threads, email chains, and tribal knowledge held by senior team members. New QA engineers would spend weeks ramping up, repeatedly asking the same questions that had been answered countless times before. Critical testing procedures, known issues, and debugging techniques were buried in documentation that was hard to discover and often outdated.",
    importance:
      "QA effectiveness depends heavily on accumulated knowledge about product behavior, test strategies, and common failure patterns. When this knowledge is fragmented or inaccessible, teams waste time rediscovering solutions, miss important edge cases, and provide inconsistent testing coverage. Centralizing and making this knowledge queryable dramatically improves both efficiency and quality.",
    build: `I designed and built a comprehensive QA knowledge management system combining graph databases with intelligent retrieval:
          • Constructed a knowledge graph capturing relationships between products, features, test cases, known issues, and resolution patterns.
          • Implemented automated knowledge extraction from existing documentation, tickets, and communication channels.
          • Built a RAG-powered assistant that provides contextual answers to QA questions, combining structured knowledge with relevant documentation.
          • Created intelligent knowledge discovery that suggests related information and identifies knowledge gaps.
          • Integrated the system into daily QA workflows through Slack bots, IDE extensions, and web interfaces.`,
    extra:
      "This system became the central nervous system for QA operations, dramatically reducing onboarding time and improving the consistency of testing practices across teams.",
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
            <div className="mb-6">
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                Engineering Manager (AI & Automation)
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">
                  Agentic systems • RAG • Developer Experience
                </span>
              </h1>
            </div>
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

          <div className="space-y-6">
            {/* Profile Image - Above Snapshot */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center"
            >
              <img 
                src="/Prashant Profile.jpg" 
                alt="Prashant Bhende" 
                className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-white/50 dark:border-white/20 shadow-xl hover:scale-105 transition-transform duration-300"
              />
            </motion.div>

            {/* Snapshot Card */}
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
                  <div className="text-2xl opacity-80">Cycle acceleration</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <Section id="projects" title="AI Projects" icon={<Rocket className="text-emerald-600 dark:text-emerald-400" />}>
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
          Hi, I’m Prashant Bhende—an Engineering Manager who’s passionate about building AI-driven tools that make developers’ lives easier. Over the past 9+ years at NVIDIA, I’ve led teams creating automation and Generative AI solutions that save thousands of engineering hours, improve defect detection, and cut down manual grunt work.<br /><br />

          I enjoy mentoring engineers, helping them grow into experts, and pushing teams to experiment with new tech like multi-agent systems, RAG pipelines, and AI-powered code review. My projects—like BAT.AI, an agentic workflow for automated log analysis and bug filing—are already being used across multiple global teams.<br /><br />

          Beyond the tech, I love solving real developer pain points and creating smoother feedback loops so people can focus on what they do best—building great software. I’m currently doing my doctoral research with GGU, exploring how Generative AI adoption can transform automation at scale.
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
          <a
            href="tel:+917507829514"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-black/10 dark:border-white/10 hover:shadow"
          >
            📞 +91-7507829514
          </a>
          <a
            href="https://linkedin.com/in/prashant-bhende"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-black/10 dark:border-white/10 hover:shadow"
          >
            💼 LinkedIn Profile
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