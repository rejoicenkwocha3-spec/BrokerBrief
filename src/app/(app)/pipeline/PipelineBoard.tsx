'use client';
import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { createDeal_action, updateDealStage_action } from '@/app/actions/deals';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

const STAGES = [
  { key: 'new_lead', label: 'New Lead', color: 'bg-gray-100' },
  { key: 'contacted', label: 'Contacted', color: 'bg-blue-50' },
  { key: 'qualified', label: 'Qualified', color: 'bg-indigo-50' },
  { key: 'proposal_sent', label: 'Proposal', color: 'bg-yellow-50' },
  { key: 'negotiation', label: 'Negotiation', color: 'bg-orange-50' },
  { key: 'won', label: 'Won', color: 'bg-green-50' },
  { key: 'lost', label: 'Lost', color: 'bg-red-50' },
];

interface Deal {
  id: string;
  title: string;
  value: number | null;
  currency: string;
  stage: string;
  probability: number | null;
  expected_close_date: string | null;
  clients: { first_name: string; last_name: string } | null;
}

interface Client { id: string; first_name: string; last_name: string }

export function PipelineBoard({ initialDeals, clients }: { initialDeals: Deal[]; clients: Client[] }) {
  const [deals, setDeals] = useState(initialDeals);
  const [addOpen, setAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dragDealId, setDragDealId] = useState<string | null>(null);
  const router = useRouter();

  const handleDrop = async (e: React.DragEvent, targetStage: string) => {
    e.preventDefault();
    if (!dragDealId) return;
    const deal = deals.find((d) => d.id === dragDealId);
    if (!deal || deal.stage === targetStage) return;

    setDeals((prev) => prev.map((d) => d.id === dragDealId ? { ...d, stage: targetStage } : d));
    await updateDealStage_action(dragDealId, targetStage, deal.stage);
    setDragDealId(null);
    router.refresh();
  };

  const handleAddDeal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const result = await createDeal_action(new FormData(e.currentTarget));
    if (!result.error) {
      setAddOpen(false);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-end mb-4">
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="w-4 h-4" /> Add Deal</Button>
          </DialogTrigger>
          <DialogContent title="Add New Deal">
            <form onSubmit={handleAddDeal} className="space-y-4">
              <div><Label htmlFor="title">Deal title *</Label><Input id="title" name="title" placeholder="Mortgage refinance — Smith family" required /></div>
              <div>
                <Label htmlFor="client_id">Client</Label>
                <select name="client_id" className="input">
                  <option value="">Select client...</option>
                  {clients.map((c) => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label htmlFor="value">Value</Label><Input id="value" name="value" type="number" placeholder="50000" /></div>
                <div>
                  <Label htmlFor="stage">Stage</Label>
                  <select name="stage" className="input">
                    {STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                  </select>
                </div>
              </div>
              <div><Label htmlFor="expected_close_date">Expected close</Label><Input id="expected_close_date" name="expected_close_date" type="date" /></div>
              <div className="flex gap-3 pt-2">
                <Button variant="ghost" type="button" onClick={() => setAddOpen(false)} className="flex-1 justify-center">Cancel</Button>
                <Button type="submit" disabled={loading} className="flex-1 justify-center">{loading ? 'Adding...' : 'Add Deal'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map(({ key, label, color }) => {
          const stageDeals = deals.filter((d) => d.stage === key);
          const total = stageDeals.reduce((s, d) => s + (d.value ?? 0), 0);

          return (
            <div
              key={key}
              className="flex-shrink-0 w-64"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, key)}
            >
              <div className={`rounded-xl ${color} p-3 min-h-[400px]`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-charcoal uppercase tracking-wide">{label}</h3>
                  <span className="text-xs text-gray-400">{stageDeals.length}</span>
                </div>
                {total > 0 && <p className="text-xs font-semibold text-emerald-brand mb-3">{formatCurrency(total)}</p>}

                <div className="space-y-2">
                  {stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={() => setDragDealId(deal.id)}
                      onDragEnd={() => setDragDealId(null)}
                      className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                    >
                      <p className="text-sm font-semibold text-charcoal leading-snug mb-1">{deal.title}</p>
                      {deal.clients && (
                        <p className="text-xs text-gray-400 mb-1.5">{(deal.clients as {first_name: string; last_name: string}).first_name} {(deal.clients as {first_name: string; last_name: string}).last_name}</p>
                      )}
                      {deal.value && (
                        <p className="text-xs font-semibold text-emerald-brand">{formatCurrency(deal.value, deal.currency)}</p>
                      )}
                      {deal.probability != null && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-100 rounded-full h-1">
                            <div className="bg-emerald-brand h-1 rounded-full" style={{ width: `${deal.probability}%` }} />
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">{deal.probability}% probability</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
