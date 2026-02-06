'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  SortAsc,
  PlusCircle,
  Tag,
} from 'lucide-react';
import { mockADRs } from '@/lib/data';
import { ADRStatus, ADRCategory } from '@/lib/types';
import StatusBadge from '@/components/StatusBadge';
import RiskBadge from '@/components/RiskBadge';
import QualityScore from '@/components/QualityScore';

const categoryLabels: Record<ADRCategory, string> = {
  'model-selection': 'Model Selection',
  'data-pipeline': 'Data Pipeline',
  'infrastructure': 'Infrastructure',
  'evaluation': 'Evaluation',
  'prompt-architecture': 'Prompt Architecture',
  'rag-architecture': 'RAG Architecture',
  'feature-store': 'Feature Store',
  'inference-serving': 'Inference Serving',
  'data-retention': 'Data Retention',
  'security': 'Security',
  'compliance': 'Compliance',
  'general': 'General',
};

export default function ADRListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ADRStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<ADRCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'number' | 'quality'>('date');

  const filteredADRs = mockADRs
    .filter((adr) => {
      if (statusFilter !== 'all' && adr.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && adr.category !== categoryFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          adr.title.toLowerCase().includes(q) ||
          adr.tags.some((t) => t.toLowerCase().includes(q)) ||
          adr.authors.some((a) => a.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      if (sortBy === 'number') return b.number - a.number;
      return (b.qualityScore || 0) - (a.qualityScore || 0);
    });

  const uniqueCategories = [...new Set(mockADRs.map((a) => a.category))];

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Architecture Decision Records</h1>
          <p className="mt-1 text-sm text-muted">
            {mockADRs.length} decisions documented across {uniqueCategories.length} categories
          </p>
        </div>
        <Link
          href="/adrs/new"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          <PlusCircle className="h-4 w-4" />
          New ADR
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search ADRs by title, tags, or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ADRStatus | 'all')}
            className="rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="proposed">Proposed</option>
            <option value="accepted">Accepted</option>
            <option value="deprecated">Deprecated</option>
            <option value="superseded">Superseded</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as ADRCategory | 'all')}
            className="rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>
                {categoryLabels[cat]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <SortAsc className="h-4 w-4 text-muted" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'number' | 'quality')}
            className="rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="date">Sort by Date</option>
            <option value="number">Sort by Number</option>
            <option value="quality">Sort by Quality</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted">
        Showing {filteredADRs.length} of {mockADRs.length} ADRs
      </p>

      {/* ADR List */}
      <div className="space-y-3">
        {filteredADRs.map((adr) => (
          <Link
            key={adr.id}
            href={`/adrs/${adr.id}`}
            className="block rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                {String(adr.number).padStart(4, '0')}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{adr.title}</h3>
                    <p className="mt-1 text-xs text-muted">
                      {adr.authors.join(', ')} · {categoryLabels[adr.category]} · Updated {adr.lastUpdated}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {adr.qualityScore && <QualityScore score={adr.qualityScore} />}
                    <StatusBadge status={adr.status} />
                  </div>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted">{adr.context}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {adr.riskClassification && (
                    <RiskBadge risk={adr.riskClassification} />
                  )}
                  {adr.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs text-muted"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                  {adr.tags.length > 4 && (
                    <span className="text-xs text-muted">+{adr.tags.length - 4} more</span>
                  )}
                  {adr.complianceFrameworks && adr.complianceFrameworks.length > 0 && (
                    <span className="inline-flex items-center rounded-md bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 text-xs text-purple-700 dark:text-purple-300">
                      {adr.complianceFrameworks.join(', ')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}

        {filteredADRs.length === 0 && (
          <div className="rounded-xl border border-dashed border-border py-12 text-center">
            <p className="text-sm text-muted">No ADRs match your filters.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setCategoryFilter('all');
              }}
              className="mt-2 text-sm text-primary hover:text-primary-dark"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
