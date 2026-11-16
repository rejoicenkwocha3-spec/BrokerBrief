import Link from 'next/link';
import { ArrowRight, Users, Kanban, Calendar, FileText, BarChart2, Sparkles, CheckCircle2, Brain, Shield, Zap } from 'lucide-react';

const modules = [
  {
    icon: Users,
    label: 'CRM',
    title: 'Client Relationship Management',
    desc: 'Every client, contact, and relationship in one structured workspace. Build complete profiles with activity history, linked deals, documents, and meeting notes — all in one place so your team always has full context.',
    features: [
      '360° client profiles with full activity history',
      'Custom fields, segments, and tags',
      'Automated follow-up reminders',
      'Contact and company linking',
      'Pipeline-integrated client view',
    ],
  },
  {
    icon: Kanban,
    label: 'Pipeline',
    title: 'Deal Pipeline Management',
    desc: 'A visual Kanban board built for brokerages. Track every opportunity through 7 customisable stages, monitor deal value and probability, and spot stale deals before they fall through.',
    features: [
      'Visual Kanban with drag-and-drop',
      'Deal value, probability and close date tracking',
      'Win/loss analysis and pipeline velocity',
      'Stale deal alerts and next-step prompts',
      'Revenue forecasting dashboard',
    ],
  },
  {
    icon: Calendar,
    label: 'Meetings',
    title: 'Meeting Intelligence',
    desc: 'Log every client meeting with structured notes and transcripts. BrokerBrief AI automatically generates meeting summaries and extracts action items so nothing gets missed after a call.',
    features: [
      'Structured meeting notes and transcripts',
      'AI-generated summaries after every meeting',
      'Automatic action item extraction',
      'Meeting history linked to each client',
      'Calendar integration ready',
    ],
  },
  {
    icon: FileText,
    label: 'Documents',
    title: 'Document Management',
    desc: 'Secure, organised document storage per client. Upload contracts, statements, and compliance documents with category tagging, version control, and AI-powered summarisation.',
    features: [
      'Per-client document organisation',
      'Category tags and version history',
      'AI document summarisation',
      'Signed URL access control',
      'Compliance-ready audit trail',
    ],
  },
  {
    icon: Sparkles,
    label: 'AI Associate',
    title: 'AI Associate',
    desc: 'Your intelligent business partner — available 24/7. Ask anything about your clients, pipeline, or business performance and get instant answers powered by your real data.',
    features: [
      'Natural language queries across all your data',
      'Client and deal summaries on demand',
      'Follow-up draft generation',
      'Pipeline health analysis',
      'Opportunity prioritisation recommendations',
    ],
  },
  {
    icon: BarChart2,
    label: 'Insights',
    title: 'Business Intelligence',
    desc: 'Real-time dashboards built from your actual business data. Track revenue, pipeline health, team performance, and client retention without building a single spreadsheet.',
    features: [
      'Revenue and pipeline dashboards',
      'Conversion rate and velocity tracking',
      'Team performance metrics',
      'Client retention analytics',
      'Custom report exports',
    ],
  },
];

export default function PlatformPage() {
  return (
    <div className="bg-soft-white">
      {/* Hero */}
      <section className="bg-forest text-white pt-20 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #079B65 0%, transparent 50%), radial-gradient(circle at 80% 50%, #8154E8 0%, transparent 50%)' }} />
        <div className="max-w-4xl mx-auto px-5 text-center relative">
          <p className="text-xs font-semibold text-emerald-brand uppercase tracking-widest mb-4">The Platform</p>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold leading-tight mb-6">
            One platform. Every tool your brokerage needs.
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            BrokerBrief brings CRM, pipeline management, meeting intelligence, document storage, and AI into a single connected system built for modern brokerages.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="inline-flex items-center gap-2 bg-emerald-brand hover:bg-[#068a58] text-white font-semibold px-7 py-3.5 rounded-xl text-base transition-colors">
              Start free trial <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/pricing" className="inline-flex items-center gap-2 border border-white/30 hover:bg-white/10 text-white font-medium px-7 py-3.5 rounded-xl text-base transition-colors">
              See pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Module breakdown */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-5 space-y-16">
          {modules.map(({ icon: Icon, label, title, desc, features }, i) => (
            <div key={label} className={`grid md:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''}`}>
              <div>
                <p className="text-xs font-semibold text-emerald-brand uppercase tracking-widest mb-3">{label}</p>
                <h2 className="font-playfair text-3xl font-bold text-charcoal mb-4">{title}</h2>
                <p className="text-gray-500 leading-relaxed mb-6">{desc}</p>
                <ul className="space-y-2.5">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-brand flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex items-center justify-center min-h-[220px]">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-mint flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-forest" />
                  </div>
                  <p className="font-playfair text-xl font-semibold text-charcoal">{title}</p>
                  <p className="text-sm text-gray-400 mt-1">BrokerBrief Platform</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Integration section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-5">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-xs font-semibold text-emerald-brand uppercase tracking-widest mb-3">Connected by design</p>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-5">
                Every module works together.
              </h2>
              <p className="text-gray-500 mb-6 leading-relaxed">
                BrokerBrief is not a collection of tools bolted together. The CRM, pipeline, meetings, documents, and AI are all built on the same data layer — so actions in one module instantly reflect across the rest.
              </p>
              <ul className="space-y-3">
                {[
                  'Log a meeting and it appears on the client timeline automatically',
                  'Advance a deal stage and the client activity log updates in real time',
                  'Upload a document and your AI Associate can reference it immediately',
                  'Assign a task from a meeting and it surfaces in your team dashboard',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                    <Zap className="w-4 h-4 text-emerald-brand flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-soft-white rounded-2xl border border-gray-100 p-6 space-y-3">
              {[
                { icon: Users, label: 'CRM', color: 'bg-mint text-forest' },
                { icon: Kanban, label: 'Pipeline', color: 'bg-mint text-forest' },
                { icon: Calendar, label: 'Meetings', color: 'bg-mint text-forest' },
                { icon: FileText, label: 'Documents', color: 'bg-mint text-forest' },
                { icon: Sparkles, label: 'AI Associate', color: 'bg-purple-100 text-purple-700' },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex items-center gap-3 bg-white rounded-xl p-3.5 border border-gray-100">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-charcoal">{label}</span>
                  <div className="ml-auto w-2 h-2 rounded-full bg-emerald-brand" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-20 bg-forest text-white">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-emerald-brand uppercase tracking-widest mb-3">Security</p>
            <h2 className="font-playfair text-3xl font-bold mb-4">Built for brokerages that handle sensitive data.</h2>
            <p className="text-white/60 max-w-xl mx-auto">Row-level security, multi-tenant isolation, and role-based access control — by design.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Row-level security', desc: 'Every database query is scoped to your organisation. No data leakage between tenants.' },
              { icon: Brain, title: 'Your data stays yours', desc: 'AI processes your data to give you answers. It never shares or trains on it.' },
              { icon: Users, title: '6-tier access control', desc: 'Owner, Admin, Manager, Broker, Staff, and read-only roles with granular permissions.' },
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

      {/* CTA */}
      <section className="py-24 bg-soft-white">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <h2 className="font-playfair text-4xl font-bold text-charcoal mb-5">Ready to run your brokerage smarter?</h2>
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
