import Link from 'next/link';
import { ArrowRight, CheckCircle2, Users, Kanban, Calendar, FileText, BarChart2, Sparkles, Shield, CheckSquare, UserCheck, Settings2 } from 'lucide-react';

const categories = [
  {
    icon: Users,
    name: 'CRM and Client Management',
    features: [
      '360° client profiles with full history',
      'Company and contact linking',
      'Activity timeline across all touchpoints',
      'Custom fields per client type',
      'Segment and tag clients for targeted outreach',
      'Automated follow-up reminders and task creation',
      'Direct link from client to their open deals',
      'Document and meeting history per client',
    ],
  },
  {
    icon: Kanban,
    name: 'Deal Pipeline',
    features: [
      'Visual Kanban board with drag-and-drop stages',
      '7 customisable deal stages',
      'Deal value, probability, and expected close date',
      'Stale deal detection and alerts',
      'Win/loss outcome tracking with notes',
      'Pipeline velocity and conversion metrics',
      'Revenue forecasting from pipeline data',
      'Team-wide pipeline visibility',
    ],
  },
  {
    icon: Calendar,
    name: 'Meeting Intelligence',
    features: [
      'Log meetings with structured notes',
      'Full transcript upload and storage',
      'AI-generated meeting summaries',
      'Automatic action item extraction',
      'Meeting history linked to each client and deal',
      'Attendee tracking and meeting type classification',
      'Follow-up task creation from meeting outcomes',
      'Calendar integration ready',
    ],
  },
  {
    icon: FileText,
    name: 'Document Management',
    features: [
      'Per-client document organisation',
      'Category tags: contracts, compliance, statements, other',
      'Secure cloud storage with signed URL access',
      'AI document summarisation',
      'Version history and upload timestamps',
      'Team-wide document visibility by role',
      'Compliance-ready audit trail',
      'Bulk upload support',
    ],
  },
  {
    icon: Sparkles,
    name: 'AI Associate',
    features: [
      'Natural language queries across all business data',
      'Client and relationship summaries on demand',
      'Pipeline health analysis and opportunity scoring',
      'Draft follow-up emails from meeting context',
      'Which deals need attention this week',
      'Team performance questions answered instantly',
      'Document-aware responses',
      'Available 24/7, responds in seconds',
    ],
  },
  {
    icon: BarChart2,
    name: 'Business Intelligence',
    features: [
      'Revenue dashboards from live pipeline data',
      'Conversion rate by stage and time period',
      'Pipeline velocity and average deal cycle',
      'Client retention and churn tracking',
      'Team activity and performance metrics',
      'Task completion rates by team member',
      'Meeting and engagement frequency reports',
      'Custom date range filters',
    ],
  },
  {
    icon: CheckSquare,
    name: 'Tasks and Automation',
    features: [
      'Task creation from meetings, deals, or manually',
      'Due date and priority assignment',
      'Team member task delegation',
      'Overdue task alerts',
      'Automatic activity logging on client interactions',
      'Pipeline stage update history',
      'Smart reminders for stale deals',
      'Email notification triggers',
    ],
  },
  {
    icon: UserCheck,
    name: 'Team and Collaboration',
    features: [
      '6 permission roles: Owner, Admin, Manager, Broker, Staff, Read-only',
      'Email invitation system for team members',
      'Shared pipeline and client views',
      'Organisation-level data isolation',
      'Per-member activity tracking',
      'Handover notes and client reassignment',
      'Multi-organisation support',
      'Audit-ready access control logs',
    ],
  },
  {
    icon: Shield,
    name: 'Security and Compliance',
    features: [
      'Row-level security on every query',
      'Multi-tenant data isolation by design',
      'Signed URL document access control',
      'No cross-tenant data exposure',
      'Role-based feature and data access',
      'Secure authentication with email confirmation',
      'AI data processing without training on your data',
      'SOC-2 aligned architecture',
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="bg-soft-white">
      {/* Hero */}
      <section className="bg-forest text-white pt-20 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #079B65 0%, transparent 50%), radial-gradient(circle at 80% 50%, #8154E8 0%, transparent 50%)' }} />
        <div className="max-w-4xl mx-auto px-5 text-center relative">
          <p className="text-xs font-semibold text-emerald-brand uppercase tracking-widest mb-4">Features</p>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold leading-tight mb-6">
            Every feature your team needs to close more deals.
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            A complete feature set built for brokerages — no missing pieces, no patchwork integrations, no extra fees for core functionality.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="inline-flex items-center gap-2 bg-emerald-brand hover:bg-[#068a58] text-white font-semibold px-7 py-3.5 rounded-xl text-base transition-colors">
              Start free trial <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/platform" className="inline-flex items-center gap-2 border border-white/30 hover:bg-white/10 text-white font-medium px-7 py-3.5 rounded-xl text-base transition-colors">
              See the platform
            </Link>
          </div>
        </div>
      </section>

      {/* Feature categories */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-5">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(({ icon: Icon, name, features }) => (
              <div key={name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="w-10 h-10 rounded-xl bg-mint flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-forest" />
                </div>
                <h3 className="font-semibold text-charcoal mb-4">{name}</h3>
                <ul className="space-y-2">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-brand flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-16 bg-forest text-white">
        <div className="max-w-5xl mx-auto px-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { n: '70+', l: 'Features included' },
              { n: '6', l: 'Permission roles' },
              { n: '7', l: 'Pipeline stages' },
              { n: '24/7', l: 'AI Associate access' },
            ].map(({ n, l }) => (
              <div key={l}>
                <p className="text-3xl font-bold text-emerald-brand mb-1">{n}</p>
                <p className="text-sm text-white/60">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-soft-white">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <h2 className="font-playfair text-4xl font-bold text-charcoal mb-5">The intelligence behind every deal.</h2>
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
