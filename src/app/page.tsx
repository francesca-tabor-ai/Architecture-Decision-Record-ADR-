'use client';

import Link from 'next/link';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  GitPullRequest,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { mockADRs } from '@/lib/data';
import StatusBadge from '@/components/StatusBadge';
import QualityScore from '@/components/QualityScore';

export default function Dashboard() {
  const totalADRs = mockADRs.length;
  const accepted = mockADRs.filter(a => a.status === 'accepted').length;
  const proposed = mockADRs.filter(a => a.status === 'proposed').length;
  const deprecated = mockADRs.filter(a => a.status === 'deprecated').length;
  const superseded = mockADRs.filter(a => a.status === 'superseded').length;
  const avgQuality = Math.round(
    mockADRs.reduce((acc, a) => acc + (a.qualityScore || 0), 0) / mockADRs.length
  );
  const highRisk = mockADRs.filter(
    a => a.riskClassification === 'high' || a.riskClassification === 'critical'
  ).length;
  const recentADRs = [...mockADRs].sort(
    (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
  ).slice(0, 5);

  const stats = [
    { label: 'Total ADRs', value: totalADRs, icon: FileText, color: 'text-primary' },
    { label: 'Accepted', value: accepted, icon: CheckCircle2, color: 'text-emerald-500' },
    { label: 'Proposed', value: proposed, icon: Clock, color: 'text-blue-500' },
    { label: 'Avg Quality', value: avgQuality, icon: TrendingUp, color: 'text-purple-500' },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">
            Overview of your team&apos;s architecture decisions
          </p>
        </div>
        <Link
          href="/adrs/new"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          <Sparkles className="h-4 w-4" />
          New ADR
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted">{stat.label}</p>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent ADRs */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="text-base font-semibold text-foreground">Recent Decisions</h2>
            <Link
              href="/adrs"
              className="flex items-center gap-1 text-sm text-primary hover:text-primary-dark"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentADRs.map((adr) => (
              <Link
                key={adr.id}
                href={`/adrs/${adr.id}`}
                className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                  {String(adr.number).padStart(3, '0')}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {adr.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {adr.authors.join(', ')} · {adr.lastUpdated}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  {adr.qualityScore && <QualityScore score={adr.qualityScore} />}
                  <StatusBadge status={adr.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Sidebar Panels */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-base font-semibold text-foreground">Status Breakdown</h3>
            <div className="mt-4 space-y-3">
              {[
                { label: 'Accepted', count: accepted, color: 'bg-emerald-500' },
                { label: 'Proposed', count: proposed, color: 'bg-blue-500' },
                { label: 'Superseded', count: superseded, color: 'bg-amber-500' },
                { label: 'Deprecated', count: deprecated, color: 'bg-red-500' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                  <span className="flex-1 text-sm text-muted">{item.label}</span>
                  <span className="text-sm font-semibold text-foreground">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Alerts */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">Compliance</h3>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 px-3 py-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span className="text-xs text-amber-700 dark:text-amber-300">
                  {highRisk} high/critical risk ADRs need review
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 px-3 py-2">
                <GitPullRequest className="h-4 w-4 text-blue-500" />
                <span className="text-xs text-blue-700 dark:text-blue-300">
                  {proposed} pending proposal{proposed !== 1 ? 's' : ''} awaiting review
                </span>
              </div>
            </div>
            <Link
              href="/compliance"
              className="mt-4 flex items-center gap-1 text-sm text-primary hover:text-primary-dark"
            >
              View compliance dashboard <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* AI Assist */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">AI Assist</h3>
            </div>
            <p className="mt-2 text-sm text-muted">
              Generate ADR drafts from natural language, code changes, or Slack threads.
            </p>
            <Link
              href="/adrs/new"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Generate ADR
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
