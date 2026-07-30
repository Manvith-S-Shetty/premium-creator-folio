import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/_admin/')({
  component: AdminDashboardOverview,
});

function AdminDashboardOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">Dashboard Overview</h1>
        <p className="text-sm text-slate-400">Welcome to your Portfolio CMS Control Center</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
          <p className="text-xs font-medium text-slate-400">Total Projects</p>
          <p className="mt-2 text-3xl font-bold text-cyan-400">3</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
          <p className="text-xs font-medium text-slate-400">Skills Tracked</p>
          <p className="mt-2 text-3xl font-bold text-indigo-400">16</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
          <p className="text-xs font-medium text-slate-400">Certificates</p>
          <p className="mt-2 text-3xl font-bold text-emerald-400">0</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
          <p className="text-xs font-medium text-slate-400">System Status</p>
          <p className="mt-2 text-sm font-semibold text-emerald-400 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Supabase Connected
          </p>
        </div>
      </div>
    </div>
  );
}
