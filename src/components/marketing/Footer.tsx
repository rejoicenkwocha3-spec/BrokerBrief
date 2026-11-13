import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-charcoal text-white py-16">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-md bg-emerald-brand flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="font-playfair font-semibold text-lg">BrokerBrief</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              The AI operating system for modern brokerages. The intelligence behind every deal.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              {['Platform', 'AI Associate', 'CRM', 'Pipeline', 'Meetings', 'Documents'].map(l => (
                <li key={l}><Link href="#" className="hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              {['About', 'Blog', 'Careers', 'Press', 'Contact'].map(l => (
                <li key={l}><Link href="#" className="hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              {['Privacy Policy', 'Terms of Service', 'Security', 'Cookies'].map(l => (
                <li key={l}><Link href="#" className="hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} BrokerBrief. All rights reserved.</p>
          <p className="text-sm text-gray-500">Built for modern brokerages.</p>
        </div>
      </div>
    </footer>
  );
}
