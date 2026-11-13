'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/browser';
import { TopBar } from '@/components/dashboard/TopBar';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { FileText, Upload, Download, Trash2 } from 'lucide-react';
import { formatDate, formatFileSize } from '@/lib/utils';
import { Spinner } from '@/components/ui/Spinner';

interface Document {
  id: string;
  name: string;
  storage_path: string;
  mime_type: string | null;
  size_bytes: number | null;
  category: string | null;
  created_at: string;
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [orgId, setOrgId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: memRaw } = await supabase.from('organisation_members').select('organisation_id').eq('user_id', user.id).limit(1).single();
      if (!memRaw) return;
      const mem = memRaw as { organisation_id: string };
      setOrgId(mem.organisation_id);
      const { data: docsRaw } = await supabase.from('documents').select('id, name, storage_path, mime_type, size_bytes, category, created_at').eq('organisation_id', mem.organisation_id).order('created_at', { ascending: false });
      setDocs((docsRaw as Document[] | null) ?? []);
      setLoading(false);
    };
    init();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !orgId) return;
    setUploading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const path = `${orgId}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage.from('documents').upload(path, file);
    if (uploadError) { setUploading(false); return; }

    const { data: doc } = await supabase.from('documents').insert({
      organisation_id: orgId,
      uploaded_by: user!.id,
      name: file.name,
      storage_path: path,
      mime_type: file.type,
      size_bytes: file.size,
    }).select('*').single();

    if (doc) setDocs((prev) => [doc as Document, ...prev]);
    setUploading(false);
  };

  const handleDownload = async (doc: Document) => {
    const supabase = createClient();
    const { data } = await supabase.storage.from('documents').createSignedUrl(doc.storage_path, 60);
    if (data?.signedUrl) window.open(data.signedUrl, '_blank');
  };

  const handleDelete = async (doc: Document) => {
    if (!confirm(`Delete "${doc.name}"?`)) return;
    const supabase = createClient();
    await supabase.storage.from('documents').remove([doc.storage_path]);
    await supabase.from('documents').delete().eq('id', doc.id);
    setDocs((prev) => prev.filter((d) => d.id !== doc.id));
  };

  return (
    <div>
      <TopBar
        title="Documents"
        actions={
          <label className="cursor-pointer">
            <input type="file" className="hidden" onChange={handleUpload} />
            <Button size="sm" disabled={uploading} className="pointer-events-none">
              {uploading ? <Spinner className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </label>
        }
      />
      <div className="p-6">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : docs.length === 0 ? (
          <EmptyState icon={FileText} title="No documents yet" description="Upload client documents, contracts, and reports." />
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-soft-white border-b border-gray-100">
                <tr>
                  {['Name', 'Type', 'Size', 'Uploaded', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {docs.map((d) => (
                  <tr key={d.id} className="border-b border-gray-50 hover:bg-soft-white transition-colors">
                    <td className="px-5 py-3.5 text-sm font-medium text-charcoal">{d.name}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{d.mime_type?.split('/')[1] ?? '—'}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{d.size_bytes ? formatFileSize(d.size_bytes) : '—'}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-400">{formatDate(d.created_at)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleDownload(d)} className="p-1.5 hover:bg-mint rounded-lg transition-colors text-gray-400 hover:text-forest">
                          <Download className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(d)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
