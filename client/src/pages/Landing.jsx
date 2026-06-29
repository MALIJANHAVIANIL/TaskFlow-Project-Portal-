import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Check, 
  Activity, 
  Users, 
  Shield, 
  Globe, 
  Clock, 
  CheckSquare, 
  Brain, 
  Menu, 
  X, 
  ChevronDown,
  BarChart3,
  Calendar,
  Lock
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Landing() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const brandLogos = [
    { name: "Notion", icon: Layers },
    { name: "Linear", icon: Sparkles },
    { name: "Slack", icon: Globe },
    { name: "GitHub", icon: Shield },
    { name: "Asana", icon: CheckSquare },
    { name: "Atlassian", icon: Lock }
  ];

  const faqs = [
    {
      q: "How does TaskFlow prioritize tasks?",
      a: "TaskFlow leverages intelligent sorting based on your custom priority flags (High, Medium, Low) and integrates deadline checking. It highlights overdue items and shows upcoming priorities directly inside the Task Analytics panel."
    },
    {
      q: "Can I invite unlimited team members?",
      a: "Yes! Our Business and Enterprise plans allow unlimited team members, complete with role-based access control to secure your project details."
    },
    {
      q: "Does it integrate with GitHub?",
      a: "TaskFlow provides direct reference capabilities. You can link task codes and project references, making it easy to trace tickets across your build pipeline."
    },
    {
      q: "Can I import Jira projects?",
      a: "We offer comprehensive CSV and API-based import tools, letting you migrate your sprints, backlogs, and Kanban boards from Jira in just a few clicks."
    },
    {
      q: "Is there a free plan?",
      a: "Yes. Our Starter plan is free forever for individuals and small teams looking to manage basic tasks and projects."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white relative selection:bg-brand-500 selection:text-white">
      {/* Background Blobs */}
      <div className="blur-blob blur-blob-blue w-96 h-96 -top-40 -left-20" />
      <div className="blur-blob blur-blob-purple w-[500px] h-[500px] top-[20%] -right-40" />
      <div className="blur-blob blur-blob-blue w-96 h-96 bottom-10 left-10" />

      {/* Cinematic grid lines */}
      <div className="guide-lines" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 bg-[#0c0c0c]/80 backdrop-blur-md border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-400 font-medium">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#dashboard" className="hover:text-white transition-colors">Dashboard</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">Resources</a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Link to="/dashboard" className="btn-primary py-2 px-5 text-sm flex items-center gap-1">
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary py-2 px-5 text-sm">
                  Start Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0c0c0c]/95 border-b border-white/10 p-6 flex flex-col gap-4 animate-fadeIn">
            <a 
              href="#features" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:text-white font-medium py-2"
            >
              Features
            </a>
            <a 
              href="#dashboard" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:text-white font-medium py-2"
            >
              Dashboard
            </a>
            <a 
              href="#pricing" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:text-white font-medium py-2"
            >
              Pricing
            </a>
            <div className="h-px bg-white/10 my-2" />
            {user ? (
              <Link 
                to="/dashboard" 
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary py-2.5 text-center flex items-center justify-center gap-2"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <div className="flex flex-col gap-3">
                <Link 
                  to="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-secondary py-2.5 text-center"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary py-2.5 text-center"
                >
                  Start Free
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 max-w-5xl mx-auto text-center z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-brand-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TaskFlow AI Release 2.0 is live</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] text-white">
            Manage Projects.<br />
            <span className="shiny-text">Deliver Faster.</span>
          </h1>

          {/* Subheading */}
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            TaskFlow helps teams plan projects, assign work, track sprint metrics, and collaborate effortlessly. Built for elite product teams.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/register" className="btn-primary py-3 px-8 text-base flex items-center gap-2 group w-full sm:w-auto justify-center">
              Start Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#pricing" className="btn-secondary py-3 px-8 text-base w-full sm:w-auto justify-center">
              Book Demo
            </a>
          </div>
          
          <p className="text-xs text-gray-500 font-light">
            Free Forever • No Credit Card Required
          </p>
        </motion.div>
      </section>

      {/* Brands Marquee */}
      <section className="border-y border-white/[0.05] bg-white/[0.01] py-10 relative overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs uppercase tracking-widest text-gray-500 font-semibold mb-6">
            Trusted by modern product teams worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60">
            {brandLogos.map((brand, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-default">
                <brand.icon className="w-5 h-5" />
                <span className="text-sm font-semibold tracking-wider">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Mock Dashboard Showcase */}
      <section id="dashboard" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Designed for execution.
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto font-light text-sm md:text-base">
            No clutter. No slow load times. Just instant visibility into workloads, projects, and sprint cycles.
          </p>
        </div>

        {/* Dashboard Glass Frame */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card overflow-hidden border border-white/[0.08] relative group"
        >
          {/* Top Bar Decoration */}
          <div className="h-10 bg-white/[0.02] border-b border-white/[0.05] flex items-center px-4 gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
            <div className="h-5 w-40 bg-white/[0.03] border border-white/[0.05] rounded-md mx-auto text-[10px] text-gray-500 flex items-center justify-center font-mono">
              taskflow.io/workspace
            </div>
          </div>

          {/* Mock Dashboard Layout */}
          <div className="grid grid-cols-12 min-h-[480px]">
            {/* Sidebar */}
            <div className="col-span-3 border-r border-white/[0.05] p-4 space-y-6 hidden lg:block bg-white/[0.01]">
              <div className="flex items-center gap-2 px-2">
                <div className="w-6 h-6 rounded-lg bg-brand-500 flex items-center justify-center text-xs font-bold text-white">T</div>
                <span className="text-xs font-semibold text-white">TaskFlow workspace</span>
              </div>
              <div className="space-y-1.5 text-xs text-gray-400">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.04] text-white"><Layers className="w-4 h-4 text-brand-400" /> Projects</div>
                <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.02] transition-all"><CheckSquare className="w-4 h-4" /> Tasks</div>
                <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.02] transition-all"><Users className="w-4 h-4" /> Teams</div>
                <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.02] transition-all"><Calendar className="w-4 h-4" /> Calendar</div>
              </div>
            </div>

            {/* Main Area */}
            <div className="col-span-12 lg:col-span-9 p-6 space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 space-y-1">
                  <div className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider">Active Projects</div>
                  <div className="text-xl font-bold text-white">12</div>
                </div>
                <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 space-y-1">
                  <div className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider">Tasks Done</div>
                  <div className="text-xl font-bold text-white">1,432</div>
                </div>
                <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 space-y-1">
                  <div className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider">Sprint Velocity</div>
                  <div className="text-xl font-bold text-brand-400">+18%</div>
                </div>
              </div>

              {/* Fake List (Linear Style) */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recent Sprints</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-all">
                    <div className="flex items-center gap-3">
                      <span className="badge-high">High</span>
                      <span className="text-xs font-medium text-white">Refactor user authentication routes</span>
                    </div>
                    <span className="text-[11px] text-gray-500">Due Tomorrow</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-all">
                    <div className="flex items-center gap-3">
                      <span className="badge-medium">Medium</span>
                      <span className="text-xs font-medium text-white">Build project member invite system</span>
                    </div>
                    <span className="text-[11px] text-gray-500">Due Jul 12</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-all">
                    <div className="flex items-center gap-3">
                      <span className="badge-low">Low</span>
                      <span className="text-xs font-medium text-white">Add PDF reports exporter module</span>
                    </div>
                    <span className="text-[11px] text-gray-500">Due Jul 25</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto relative z-10 bg-white/[0.01] border-y border-white/[0.05]">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Built for modern workflows.
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto font-light text-sm md:text-base">
            Everything your product development team needs to plan and execute in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="glass-card-hover p-6 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
              <Layers className="w-5 h-5 text-brand-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Project Dashboards</h3>
            <p className="text-gray-400 text-xs font-light leading-relaxed">
              Create structured folders, add timelines, link assignees, and track progress using advanced statistics summaries.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card-hover p-6 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Kanban Boards</h3>
            <p className="text-gray-400 text-xs font-light leading-relaxed">
              Visualize task workflows using custom status columns. Instantly change task status by dragging cards across columns.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card-hover p-6 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Team Management</h3>
            <p className="text-gray-400 text-xs font-light leading-relaxed">
              Invite team members, assign specific tasks, track workloads, and review completed tickets in real-time.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass-card-hover p-6 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-teal-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Deadline Tracking</h3>
            <p className="text-gray-400 text-xs font-light leading-relaxed">
              Receive smart overdue warnings when tasks are past their due dates. Ensure nothing drops out of scope.
            </p>
          </div>

          {/* Card 5 */}
          <div className="glass-card-hover p-6 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-pink-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Advanced Statistics</h3>
            <p className="text-gray-400 text-xs font-light leading-relaxed">
              Review completed counts, priority distributions, and sprint health summaries via detailed dashboard analytics.
            </p>
          </div>

          {/* Card 6 */}
          <div className="glass-card-hover p-6 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Security & Roles</h3>
            <p className="text-gray-400 text-xs font-light leading-relaxed">
              Implement protection layers using secure cookies, Helmet headers, CORS validation, and project access checks.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
            Simple, honest pricing.
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto font-light text-sm md:text-base">
            No hidden fees. Choose a plan that matches your team size and scaling speed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Plan */}
          <div className="glass-card p-8 flex flex-col justify-between border-white/[0.05]">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold">Starter</h3>
                <p className="text-xs text-gray-500">For individuals and startup cells</p>
              </div>
              <div className="text-4xl font-extrabold">$0</div>
              <div className="h-px bg-white/10" />
              <ul className="space-y-2 text-xs text-gray-400">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-brand-400" /> Up to 3 active projects</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-brand-400" /> Standard Kanban view</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-brand-400" /> Task prioritization flags</li>
              </ul>
            </div>
            <Link to="/register" className="btn-secondary w-full text-center text-xs mt-8">
              Start Free
            </Link>
          </div>

          {/* Professional Plan (Highlighted) */}
          <div className="glass-card p-8 flex flex-col justify-between border-brand-500/30 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white font-mono text-[9px] uppercase tracking-wider font-semibold py-1 px-3 rounded-full">
              Most Popular
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold">Professional</h3>
                <p className="text-xs text-gray-500">For active builders and scaling teams</p>
              </div>
              <div className="text-4xl font-extrabold">
                $9 <span className="text-xs text-gray-500 font-light">/ month</span>
              </div>
              <div className="h-px bg-white/10" />
              <ul className="space-y-2 text-xs text-gray-400">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-brand-400" /> Unlimited active projects</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-brand-400" /> Unlimited sprints & Kanban</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-brand-400" /> Workspace activity feeds</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-brand-400" /> Priority stats panels</li>
              </ul>
            </div>
            <Link to="/register" className="btn-primary w-full text-center text-xs mt-8">
              Upgrade to Pro
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="glass-card p-8 flex flex-col justify-between border-white/[0.05]">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold">Business</h3>
                <p className="text-xs text-gray-500">For enterprise scale organizations</p>
              </div>
              <div className="text-4xl font-extrabold">
                $19 <span className="text-xs text-gray-500 font-light">/ month</span>
              </div>
              <div className="h-px bg-white/10" />
              <ul className="space-y-2 text-xs text-gray-400">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-brand-400" /> Everything in Pro</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-brand-400" /> Dedicated workspace dashboard</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-brand-400" /> Priority 24/7 technical support</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-brand-400" /> Custom integrations builder</li>
              </ul>
            </div>
            <Link to="/register" className="btn-secondary w-full text-center text-xs mt-8">
              Upgrade to Business
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 max-w-6xl mx-auto relative z-10 border-t border-white/[0.05]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 space-y-4">
            <p className="text-gray-300 text-xs italic font-light">
              "Our productivity increased by 42% after switching to TaskFlow. The clarity on tasks is incredible."
            </p>
            <div>
              <h4 className="text-xs font-bold">Sarah Johnson</h4>
              <p className="text-[10px] text-gray-500">Engineering Director, SPOTIFY</p>
            </div>
          </div>
          <div className="glass-card p-6 space-y-4">
            <p className="text-gray-300 text-xs italic font-light">
              "Our distributed team finally feels organized. The Kanban sprint setup works perfectly."
            </p>
            <div>
              <h4 className="text-xs font-bold">Daniel Wu</h4>
              <p className="text-[10px] text-gray-500">CTO, NOTION</p>
            </div>
          </div>
          <div className="glass-card p-6 space-y-4">
            <p className="text-gray-300 text-xs italic font-light">
              "The advanced analytics dashboard keeps us focused. We save hours of alignment meetings every week."
            </p>
            <div>
              <h4 className="text-xs font-bold">Michael Brown</h4>
              <p className="text-[10px] text-gray-500">Product Lead, ATLASSIAN</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 max-w-4xl mx-auto relative z-10">
        <h2 className="text-3xl font-bold tracking-tight text-center text-white mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-card overflow-hidden border-white/[0.05]">
              <button 
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full p-5 flex items-center justify-between text-left font-medium text-sm text-white hover:bg-white/[0.01] transition-all"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${activeFaq === i ? "rotate-180" : ""}`} />
              </button>
              {activeFaq === i && (
                <div className="p-5 pt-0 text-xs font-light leading-relaxed text-gray-400 border-t border-white/[0.03] bg-white/[0.005]">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center relative z-10 border-t border-white/[0.05]">
        <div className="space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Build Faster. Collaborate Better.
          </h2>
          <p className="text-gray-400 text-base max-w-xl mx-auto font-light leading-relaxed">
            Join thousands of modern product builders already scaling workflows with TaskFlow.
          </p>
          <div className="pt-4">
            <Link to="/register" className="btn-primary py-3 px-8 text-base inline-flex items-center gap-2 group">
              Start Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] bg-white/[0.005] py-16 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold tracking-tight text-white">TaskFlow</span>
            </div>
            <p className="text-xs text-gray-500 max-w-xs font-light leading-relaxed">
              TaskFlow simplifies task coordination, project dashboards, and workspace updates for elite tech teams.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2 text-xs text-gray-500 font-light">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#dashboard" className="hover:text-white transition-colors">Workspace</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2 text-xs text-gray-500 font-light">
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2 text-xs text-gray-500 font-light">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact sales</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-white/[0.03] mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 font-light">
          <span>&copy; {new Date().getFullYear()} TaskFlow Inc. All rights reserved.</span>
          <span className="flex gap-4 mt-4 sm:mt-0">
            <a href="#" className="hover:text-white">GitHub</a>
            <a href="#" className="hover:text-white">Twitter</a>
            <a href="#" className="hover:text-white">LinkedIn</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
