import {
  FiActivity,
  FiArrowRight,
  FiCheck,
  FiChevronRight,
  FiCode,
  FiGitBranch,
  FiLayers,
  FiShield,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const features = [
  {
    icon: FiGitBranch,
    title: "Engineering Workflows",
    description:
      "Bring projects, teams, services and engineering activity into one connected workspace.",
  },
  {
    icon: FiActivity,
    title: "Operational Visibility",
    description:
      "Understand what's happening across your engineering environment without jumping between tools.",
  },
  {
    icon: FiUsers,
    title: "Team Collaboration",
    description:
      "Organize engineering teams, ownership and responsibilities around the services they operate.",
  },
  {
    icon: FiLayers,
    title: "Service Management",
    description:
      "Keep your services structured with ownership, configuration and operational context.",
  },
  {
    icon: FiZap,
    title: "Incident Response",
    description:
      "Create a clear operational workflow for identifying and responding to engineering incidents.",
  },
  {
    icon: FiShield,
    title: "Built With Security",
    description:
      "Authentication, authorization and security-minded infrastructure are part of the platform foundation.",
  },
];

const workflow = [
  {
    number: "01",
    title: "Connect your engineering workspace",
    description:
      "Create your organization, teams, projects and services in one centralized environment.",
  },
  {
    number: "02",
    title: "Understand what is happening",
    description:
      "Track engineering activity, service ownership and operational events from a single interface.",
  },
  {
    number: "03",
    title: "Operate with confidence",
    description:
      "Build a repeatable workflow for incidents, deployments and engineering operations.",
  },
];

const Home = () => {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-slate-200">
      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-800/70 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
          {/* Logo */}

          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-600/20">
              D
            </div>

            <div>
              <p className="text-sm font-bold tracking-wide text-white">
                DevFlow
              </p>

              <p className="hidden text-[10px] uppercase tracking-wider text-slate-500 sm:block">
                Engineering Platform
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Features
            </a>

            <a
              href="#workflow"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Workflow
            </a>

            <a
              href="#security"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Security
            </a>
          </nav>

          {/* Auth */}

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-white"
            >
              Sign in
            </Link>

            <Link
              to="/register"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 transition hover:bg-blue-500"
            >
              <span className="hidden sm:inline">
                Get started
              </span>

              <FiArrowRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative">
        {/* Background */}

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />

          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.035)_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-20 sm:px-6 sm:pt-28 lg:px-8 lg:pb-28">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-3.5 py-1.5 text-xs font-medium text-blue-400">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />

              Engineering workflow, unified
            </div>

            {/* Heading */}

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-7xl">
              The command center for
              <span className="block text-blue-500">
                modern engineering teams.
              </span>
            </h1>

            {/* Description */}

            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              DevFlow brings your engineering projects, teams,
              services and operational workflows together so
              your team can build, deploy and operate with
              greater visibility.
            </p>

            {/* CTA */}

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/register"
                className="group flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-blue-600/20 transition hover:bg-blue-500 sm:w-auto"
              >
                Start building

                <FiArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>

              <Link
                to="/login"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-900/50 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-700 hover:bg-slate-900 hover:text-white sm:w-auto"
              >
                Sign in to DevFlow
              </Link>
            </div>

            <p className="mt-5 text-xs text-slate-600">
              Built for engineering teams and technical
              operations.
            </p>
          </div>

          {/* =================================================
              PRODUCT PREVIEW
          ================================================== */}

          <div className="mx-auto mt-16 max-w-6xl sm:mt-20">
            <div className="relative rounded-2xl border border-slate-800 bg-slate-900/70 p-2 shadow-2xl shadow-black/30 backdrop-blur">
              {/* Window top */}

              <div className="flex h-10 items-center border-b border-slate-800 px-3">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                </div>

                <div className="mx-auto rounded-md border border-slate-800 bg-slate-950 px-20 py-1 text-[10px] text-slate-600 sm:px-32">
                  app.devflow
                </div>
              </div>

              {/* Fake Dashboard */}

              <div className="grid min-h-[340px] grid-cols-12 overflow-hidden rounded-b-xl bg-slate-950">
                {/* Sidebar */}

                <div className="col-span-3 hidden border-r border-slate-800 p-4 sm:block">
                  <div className="mb-6 flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md bg-blue-600" />

                    <div className="h-2 w-16 rounded bg-slate-800" />
                  </div>

                  <div className="space-y-2">
                    <div className="rounded-md bg-blue-600/10 px-3 py-2">
                      <div className="h-2 w-20 rounded bg-blue-500/40" />
                    </div>

                    <div className="px-3 py-2">
                      <div className="h-2 w-16 rounded bg-slate-800" />
                    </div>

                    <div className="px-3 py-2">
                      <div className="h-2 w-20 rounded bg-slate-800" />
                    </div>

                    <div className="px-3 py-2">
                      <div className="h-2 w-14 rounded bg-slate-800" />
                    </div>
                  </div>
                </div>

                {/* Content */}

                <div className="col-span-12 p-5 sm:col-span-9 sm:p-7">
                  <div className="mb-6">
                    <div className="h-3 w-28 rounded bg-blue-500/30" />

                    <div className="mt-3 h-5 w-40 rounded bg-slate-800" />

                    <div className="mt-2 h-2 w-64 max-w-full rounded bg-slate-900" />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      "Projects",
                      "Services",
                      "Incidents",
                    ].map((item) => (
                      <div
                        key={item}
                        className="rounded-lg border border-slate-800 bg-slate-900/70 p-4"
                      >
                        <div className="h-2 w-16 rounded bg-slate-700" />

                        <div className="mt-3 h-6 w-10 rounded bg-slate-800" />

                        <div className="mt-2 h-2 w-20 rounded bg-slate-900" />
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="h-28 rounded-lg border border-slate-800 bg-slate-900/50 sm:col-span-2" />

                    <div className="h-28 rounded-lg border border-slate-800 bg-slate-900/50" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          TRUST / POSITIONING
      ====================================================== */}

      <section className="border-y border-slate-800/70 bg-slate-900/20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-8 sm:px-6 md:flex-row lg:px-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-slate-600">
              One engineering workspace
            </p>

            <p className="mt-1 text-sm text-slate-400">
              From project organization to operational
              visibility.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium text-slate-600">
            <span>PROJECTS</span>
            <span>TEAMS</span>
            <span>SERVICES</span>
            <span>INCIDENTS</span>
            <span>ACTIVITY</span>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURES
      ====================================================== */}

      <section
        id="features"
        className="scroll-mt-20 px-5 py-20 sm:px-6 lg:px-8 lg:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-blue-400">
              Platform capabilities
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Everything your engineering workspace needs.
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-400">
              DevFlow is designed around the actual workflow
              of software engineering teams — not another
              generic project management board.
            </p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-slate-800 bg-slate-800 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="bg-slate-950 p-7 transition hover:bg-slate-900"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    <Icon size={19} />
                  </div>

                  <h3 className="mt-5 text-base font-semibold text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          WORKFLOW
      ====================================================== */}

      <section
        id="workflow"
        className="scroll-mt-20 border-y border-slate-800/70 bg-slate-900/20 px-5 py-20 sm:px-6 lg:px-8 lg:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            {/* Left */}

            <div>
              <p className="text-sm font-medium text-blue-400">
                Engineering workflow
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Move from fragmented tools to a connected workflow.
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 text-slate-400">
                DevFlow creates a shared operational context
                around the things your engineering organization
                already works with.
              </p>

              <Link
                to="/register"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-blue-400 transition hover:text-blue-300"
              >
                Create your workspace
                <FiArrowRight size={15} />
              </Link>
            </div>

            {/* Right */}

            <div className="space-y-3">
              {workflow.map((item) => (
                <div
                  key={item.number}
                  className="group rounded-xl border border-slate-800 bg-slate-950 p-5 transition hover:border-slate-700"
                >
                  <div className="flex gap-4">
                    <span className="text-xs font-semibold text-blue-500">
                      {item.number}
                    </span>

                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {item.description}
                      </p>
                    </div>

                    <FiChevronRight
                      size={16}
                      className="ml-auto mt-0.5 shrink-0 text-slate-700 transition group-hover:text-slate-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SECURITY
      ====================================================== */}

      <section
        id="security"
        className="scroll-mt-20 px-5 py-20 sm:px-6 lg:px-8 lg:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40">
            <div className="grid lg:grid-cols-2">
              <div className="p-8 sm:p-10 lg:p-14">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <FiShield size={21} />
                </div>

                <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl">
                  Security belongs in the foundation.
                </h2>

                <p className="mt-4 max-w-lg text-sm leading-7 text-slate-400">
                  DevFlow is being built with security-conscious
                  engineering practices from the beginning,
                  including authenticated APIs, protected
                  routes, role-based access and secure
                  credential handling.
                </p>

                <div className="mt-7 space-y-3">
                  {[
                    "Authenticated API access",
                    "Role-based permissions",
                    "Secure password hashing",
                    "Protected engineering resources",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm text-slate-400"
                    >
                      <FiCheck
                        size={15}
                        className="text-blue-400"
                      />

                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative min-h-[300px] overflow-hidden border-t border-slate-800 bg-slate-950 p-8 lg:border-l lg:border-t-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.10),_transparent_60%)]" />

                <div className="relative flex h-full items-center justify-center">
                  <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                          <FiCode size={17} />
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-white">
                            API Security
                          </p>

                          <p className="mt-1 text-[10px] text-slate-600">
                            DevFlow Infrastructure
                          </p>
                        </div>
                      </div>

                      <span className="rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2 py-1 text-[10px] text-emerald-400">
                        Protected
                      </span>
                    </div>

                    <div className="mt-5 space-y-2">
                      {[
                        "Authentication",
                        "Authorization",
                        "Request protection",
                        "Secure credentials",
                      ].map((item) => (
                        <div
                          key={item}
                          className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950 px-3 py-2.5"
                        >
                          <span className="text-xs text-slate-400">
                            {item}
                          </span>

                          <FiCheck
                            size={14}
                            className="text-emerald-400"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ====================================================== */}

      <section className="px-5 pb-20 sm:px-6 lg:px-8 lg:pb-28">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-blue-500/20 bg-blue-600/5 px-6 py-14 text-center sm:px-10">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <FiZap size={21} />
          </div>

          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Build your engineering command center.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400">
            Start organizing your engineering workspace with
            DevFlow and build a clearer operational workflow
            for your team.
          </p>

          <div className="mt-7">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-blue-600/20 transition hover:bg-blue-500"
            >
              Get started with DevFlow
              <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="border-t border-slate-800/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
              D
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                DevFlow
              </p>

              <p className="text-[10px] text-slate-600">
                Engineering Platform
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-5 text-xs text-slate-600">
            <a
              href="#features"
              className="transition hover:text-slate-300"
            >
              Features
            </a>

            <a
              href="#workflow"
              className="transition hover:text-slate-300"
            >
              Workflow
            </a>

            <Link
              to="/login"
              className="transition hover:text-slate-300"
            >
              Sign in
            </Link>

            <Link
              to="/register"
              className="transition hover:text-slate-300"
            >
              Register
            </Link>
          </div>

          <p className="text-xs text-slate-700">
            © {new Date().getFullYear()} DevFlow
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Home;