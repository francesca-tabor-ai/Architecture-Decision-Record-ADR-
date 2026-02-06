'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  GitBranch,
  PlusCircle,
  CheckCircle2,
  XCircle,
  ArrowRightLeft,
  Pencil,
  Filter,
  Calendar,
} from 'lucide-react';
import { timelineEvents, mockADRs, getADRById } from '@/lib/data';

const eventIcons: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  created: {
    icon: <PlusCircle className="h-4 w-4" />,
    color: 'text-blue-500',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
  },
  accepted: {
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: 'text-emerald-500',
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
  deprecated: {
    icon: <XCircle className="h-4 w-4" />,
    color: 'text-red-500',
    bg: 'bg-red-100 dark:bg-red-900/30',
  },
  superseded: {
    icon: <ArrowRightLeft className="h-4 w-4" />,
    color: 'text-amber-500',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
  },
  updated: {
    icon: <Pencil className="h-4 w-4" />,
    color: 'text-purple-500',
    bg: 'bg-purple-100 dark:bg-purple-900/30',
  },
};

export default function TimelinePage() {
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredEvents = timelineEvents
    .filter((evt) => typeFilter === 'all' || evt.type === typeFilter)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Group events by month
  const grouped: Record<string, typeof filteredEvents> = {};
  filteredEvents.forEach((evt) => {
    const monthKey = evt.date.slice(0, 7); // YYYY-MM
    if (!grouped[monthKey]) grouped[monthKey] = [];
    grouped[monthKey].push(evt);
  });

  const formatMonth = (key: string) => {
    const [year, month] = key.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  // Decision Lineage Graph (simplified)
  const lineageADRs = mockADRs.filter(
    (a) => a.supersedes || a.supersededBy || (a.relatedADRs && a.relatedADRs.length > 0)
  );

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Timeline & Lineage</h1>
        <p className="mt-1 text-sm text-muted">
          Chronological view of architecture decisions and their relationships
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters */}
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-muted" />
            <div className="flex rounded-lg border border-border bg-card p-0.5">
              {[
                { id: 'all', label: 'All' },
                { id: 'created', label: 'Created' },
                { id: 'accepted', label: 'Accepted' },
                { id: 'superseded', label: 'Superseded' },
                { id: 'deprecated', label: 'Deprecated' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setTypeFilter(f.id)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    typeFilter === f.id
                      ? 'bg-primary text-white'
                      : 'text-muted hover:text-foreground'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline Events */}
          {Object.entries(grouped).map(([monthKey, events]) => (
            <div key={monthKey}>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-4 w-4 text-muted" />
                <h2 className="text-sm font-semibold text-foreground">{formatMonth(monthKey)}</h2>
                <span className="text-xs text-muted">({events.length} events)</span>
              </div>

              <div className="relative ml-4 space-y-0">
                {/* Vertical Line */}
                <div className="absolute left-3 top-0 h-full w-0.5 bg-border" />

                {events.map((evt, index) => {
                  const config = eventIcons[evt.type];
                  const adr = getADRById(evt.adrId);
                  return (
                    <div
                      key={evt.id}
                      className="relative flex gap-4 pb-6"
                    >
                      {/* Node */}
                      <div
                        className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${config.bg} ${config.color}`}
                      >
                        {config.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pt-0.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm text-foreground">
                              <span className="font-medium">{evt.description}</span>
                            </p>
                            <Link
                              href={`/adrs/${evt.adrId}`}
                              className="mt-0.5 text-xs text-primary hover:underline"
                            >
                              ADR-{String(adr?.number || 0).padStart(4, '0')}: {evt.adrTitle}
                            </Link>
                          </div>
                          <span className="shrink-0 text-xs text-muted">{evt.date}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Decision Lineage Graph */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold text-foreground">Decision Lineage</h2>
            </div>
            <p className="mt-1 text-xs text-muted">How decisions relate to and build on each other</p>

            <div className="mt-4 space-y-4">
              {lineageADRs.map((adr) => {
                const supersedesADR = adr.supersedes ? getADRById(adr.supersedes) : null;
                const supersededByADR = adr.supersededBy ? getADRById(adr.supersededBy) : null;

                return (
                  <div
                    key={adr.id}
                    className="rounded-lg border border-border p-3"
                  >
                    <Link
                      href={`/adrs/${adr.id}`}
                      className="text-sm font-medium text-foreground hover:text-primary"
                    >
                      ADR-{String(adr.number).padStart(4, '0')}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted line-clamp-1">{adr.title}</p>

                    {/* Connections */}
                    <div className="mt-2 space-y-1">
                      {supersedesADR && (
                        <div className="flex items-center gap-1.5 text-xs">
                          <ArrowRightLeft className="h-3 w-3 text-amber-500" />
                          <span className="text-muted">supersedes</span>
                          <Link
                            href={`/adrs/${supersedesADR.id}`}
                            className="text-primary hover:underline"
                          >
                            ADR-{String(supersedesADR.number).padStart(4, '0')}
                          </Link>
                        </div>
                      )}
                      {supersededByADR && (
                        <div className="flex items-center gap-1.5 text-xs">
                          <ArrowRightLeft className="h-3 w-3 text-red-500" />
                          <span className="text-muted">superseded by</span>
                          <Link
                            href={`/adrs/${supersededByADR.id}`}
                            className="text-primary hover:underline"
                          >
                            ADR-{String(supersededByADR.number).padStart(4, '0')}
                          </Link>
                        </div>
                      )}
                      {adr.relatedADRs?.map((rid) => {
                        const related = getADRById(rid);
                        if (!related) return null;
                        return (
                          <div key={rid} className="flex items-center gap-1.5 text-xs">
                            <GitBranch className="h-3 w-3 text-blue-500" />
                            <span className="text-muted">related to</span>
                            <Link
                              href={`/adrs/${related.id}`}
                              className="text-primary hover:underline"
                            >
                              ADR-{String(related.number).padStart(4, '0')}
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground">Timeline Stats</h3>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Total Events</span>
                <span className="font-medium text-foreground">{timelineEvents.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Date Range</span>
                <span className="font-medium text-foreground">Dec 2024 — Feb 2025</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Supersession Chains</span>
                <span className="font-medium text-foreground">1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
