import Link from 'next/link';
import { ArrowRight, Users, Calendar, Kanban, FileText, BarChart2, Brain, Shield, CheckCircle2, Sparkles, Zap, Globe, AlertCircle, TrendingUp, Database, Clock } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="bg-soft-white">
      {/* Hero */}
      <section className="bg-forest text-white pt-20 pb-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #079B65 0%, transparent 50%), radial-gradient(circle at 80% 50%, #8154E8 0%, transparent 50%)' }} />
        <div className="max-w-5xl mx-auto px-5 text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-8">
            <Sparkles className="w-3.5 h-3.5 text-emerald-brand" />
            <span className="text-white/80">Introducing BrokerBrief AI Associate</span>
          </div>
          <h1 className="font-playfair text-4xl md:text-6xl font-bold leading-tight mb-6">
            Your brokerage.<br />
            <em className="italic not-italic" style={{ color: '#10B981' }}>Smarter</em>, faster, and<br />
            powered by AI.
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            BrokerBrief is the complete AI operating system for modern brokerages: CRM, pipeline, meetings, documents, and intelligent insights in one unified platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="inline-flex items-center gap-2 bg-emerald-brand hover:bg-[#068a58] text-white font-semibold px-7 py-3.5 rounded-xl text-base transition-colors">
              Start free trial <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/pricing" className="inline-flex items-center gap-2 border border-white/30 hover:bg-white/10 text-white font-medium px-7 py-3.5 rounded-xl text-base transition-colors">
              See pricing
            </Link>
          </div>
          <p className="mt-6 text-sm text-white/50">No credit card required · 14-day free trial · Setup in 5 minutes</p>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-5 text-center">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8">Trusted by forward-thinking brokerages</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { n: '10,000+', l: 'Deals managed' },
              { n: '500+', l: 'Brokerages onboarded' },
              { n: '98%', l: 'Client retention rate' },
              { n: '3.2×', l: 'Average revenue growth' },
            ].map(({ n, l }) => (
              <div key={l}>
                <p className="text-3xl font-bold text-forest mb-1">{n}</p>
                <p className="text-sm text-gray-500">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-emerald-brand uppercase tracking-widest mb-3">The Problem</p>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-4">
              Your brokerage runs on scattered tools and lost context.
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Spreadsheets, email threads, disconnected CRMs, and manual follow-ups — your team spends more time managing tools than managing clients.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {[
              { icon: Database, title: 'No single source of truth', desc: 'Client data lives in 5 different places. No one has the full picture.' },
              { icon: Clock, title: 'Deals slip through the cracks', desc: 'Without structured pipeline management, opportunities are lost to follow-up failure.' },
              { icon: TrendingUp, title: 'Insights are manual', desc: "Your team spends hours building reports instead of building relationships." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-red-50 border border-red-100 rounded-xl p-5">
                <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center mb-3">
                  <Icon className="w-4.5 h-4.5 text-red-500" />
                </div>
                <h3 className="font-semibold text-charcoal mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-emerald-brand uppercase tracking-widest mb-3">The Solution</p>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-4">
              Everything your brokerage needs. Nothing you don&apos;t.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Users, title: 'Unified client intelligence', desc: 'Every client, deal, meeting, and document in one structured workspace.' },
              { icon: Kanban, title: 'AI-powered pipeline', desc: 'Smart deal tracking with automated follow-ups and next-step recommendations.' },
              { icon: BarChart2, title: 'Instant insights', desc: 'Ask your AI Associate anything about your business. Get answers in seconds.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-mint border border-green-100 rounded-xl p-5">
                <div className="w-9 h-9 rounded-lg bg-white/60 flex items-center justify-center mb-3">
                  <Icon className="w-4.5 h-4.5 text-forest" />
                </div>
                <h3 className="font-semibold text-charcoal mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Associate */}
      <section className="py-20 bg-gradient-to-br from-[#1a0533] to-[#0d2b1a] text-white">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-ai-purple/20 border border-ai-purple/30 rounded-full px-4 py-1.5 text-sm mb-6">
              <Sparkles className="w-3.5 h-3.5 text-ai-purple" />
              <span className="text-ai-purple font-medium">AI Associate</span>
            </div>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
              Your intelligent business partner. Available 24/7.
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">Ask anything about your clients, deals, or pipeline. Get instant, accurate answers powered by your real business data.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-2xl mx-auto">
            {[
              'Which clients need my attention this week?',
              'Show me deals that haven\'t progressed in 2 weeks.',
              'Summarise my last meeting with Blackstone Capital.',
              'Which opportunities should my team prioritise this quarter?',
              'Draft a follow-up email for my pipeline deals.',
            ].map((prompt) => (
              <div key={prompt} className="flex items-start gap-3 mb-4 last:mb-0">
                <div className="w-6 h-6 rounded-full bg-ai-purple/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-3 h-3 text-ai-purple" />
                </div>
                <p className="text-sm text-white/70 italic">&ldquo;{prompt}&rdquo;</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/signup" className="inline-flex items-center gap-2 bg-ai-purple hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors">
              Try AI Associate free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-emerald-brand uppercase tracking-widest mb-3">Platform</p>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-4">
              Everything your team needs to close more deals.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Users,
                title: 'CRM and Client Management',
                desc: 'Complete client profiles with activity history, notes, documents, and linked deals. Never lose context on a relationship.',
                features: ['360° client profiles', 'Activity timeline', 'Custom segments and tags', 'Automated follow-up reminders'],
              },
              {
                icon: Kanban,
                title: 'Deal Pipeline',
                desc: 'Visual Kanban pipeline with 7 customisable stages. Track deal value, probability, and expected close dates.',
                features: ['Visual Kanban board', 'Deal value tracking', 'Win/loss analysis', 'Pipeline velocity metrics'],
              },
              {
                icon: Calendar,
                title: 'Meeting Intelligence',
                desc: 'Log meetings with notes and transcripts. AI automatically generates summaries and extracts action items.',
                features: ['Meeting notes and transcripts', 'AI-generated summaries', 'Action item extraction', 'Calendar integration ready'],
              },
              {
                icon: FileText,
                title: 'Document Management',
                desc: 'Secure document storage with per-client organisation, category tagging, and AI-powered summarisation.',
                features: ['Secure cloud storage', 'Per-client organisation', 'AI document summaries', 'Signed URL access control'],
              },
              {
                icon: BarChart2,
                title: 'Business Intelligence',
                desc: 'Real-time analytics on clients, deals, revenue, and team performance. All from your actual data.',
                features: ['Revenue dashboards', 'Pipeline analytics', 'Team performance', 'Conversion tracking'],
              },
              {
                icon: Users,
                title: 'Team Collaboration',
                desc: 'Multi-role team management with organisation-level data isolation and granular permission controls.',
                features: ['6 permission roles', 'Invitation system', 'Shared pipeline view', 'Audit-ready access control'],
              },
            ].map(({ icon: Icon, title, desc, features }) => (
              <div key={title} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-11 h-11 rounded-xl bg-mint flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-forest" />
                </div>
                <h3 className="font-semibold text-charcoal text-lg mb-2">{title}</h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">{desc}</p>
                <ul className="space-y-1.5">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-bright-green flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Automation */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-5">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-xs font-semibold text-emerald-brand uppercase tracking-widest mb-3">Automation</p>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-5">
                Eliminate repetitive work. Automate the routine.
              </h2>
              <p className="text-gray-500 mb-6 leading-relaxed">
                BrokerBrief handles the operational overhead — task reminders, follow-up scheduling, pipeline updates — so your team focuses on conversations that close deals.
              </p>
              <ul className="space-y-3">
                {[
                  'Automatic activity logging on every client interaction',
                  'Smart task creation from meeting action items',
                  'Pipeline stage updates with deal history tracking',
                  'Overdue task and stale deal alerts',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                    <Zap className="w-4 h-4 text-emerald-brand flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-soft-white rounded-2xl p-6 border border-gray-100">
              <div className="space-y-3">
                {[
                  { step: '01', title: 'Client meeting logged', desc: 'Notes and transcript saved automatically' },
                  { step: '02', title: 'AI generates summary', desc: 'Key points and action items extracted' },
                  { step: '03', title: 'Tasks created', desc: 'Follow-up tasks assigned to team members' },
                  { step: '04', title: 'Pipeline updated', desc: 'Deal stage progressed based on meeting outcome' },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex items-start gap-4 bg-white rounded-xl p-4 border border-gray-100">
                    <span className="text-xs font-bold text-emerald-brand bg-mint px-2 py-1 rounded-md flex-shrink-0">{step}</span>
                    <div>
                      <p className="text-sm font-semibold text-charcoal">{title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-20 bg-forest text-white">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-emerald-brand uppercase tracking-widest mb-3">Security and Compliance</p>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">Built for brokerages that handle sensitive data.</h2>
            <p className="text-white/60 max-w-xl mx-auto">Enterprise-grade security with multi-tenant data isolation, role-based access control, and signed document access — by design, not as an afterthought.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Row-Level Security', desc: 'Every database query is scoped to your organisation. No shared data, no data leakage between tenants.' },
              { icon: Globe, title: 'Multi-Tenant Architecture', desc: 'Complete organisation isolation with 6-tier role system: Owner, Admin, Manager, Broker, Staff.' },
              { icon: Brain, title: 'Your data stays yours', desc: 'Documents stored with signed URLs. No public access. AI processes your data, never shares it.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="w-10 h-10 rounded-lg bg-emerald-brand/20 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-emerald-brand" />
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-white/60">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-soft-white">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-5">
            The intelligence behind every deal.
          </h2>
          <p className="text-lg text-gray-500 mb-10">Start your 14-day free trial. No credit card required.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="inline-flex items-center gap-2 bg-emerald-brand hover:bg-[#068a58] text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors">
              Start free trial <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/pricing" className="inline-flex items-center gap-2 border border-gray-200 hover:bg-light-grey text-charcoal font-medium px-8 py-4 rounded-xl text-base transition-colors">
              View pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
