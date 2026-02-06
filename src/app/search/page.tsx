'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Sparkles,
  FileText,
  Tag,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { searchADRs, mockADRs } from '@/lib/data';
import { ADR } from '@/lib/types';
import StatusBadge from '@/components/StatusBadge';
import RiskBadge from '@/components/RiskBadge';

const suggestedQueries = [
  'model selection',
  'vector database',
  'data retention GDPR',
  'inference serving',
  'prompt templates',
  'feature store',
  'kubernetes deployment',
  'compliance EU AI Act',
];

function highlightMatch(text: string, query: string): string {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '**$1**');
}

function RelevanceScore({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1.5 w-3 rounded-full ${
              i <= Math.ceil(score * 5)
                ? 'bg-primary'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-muted">{Math.round(score * 100)}%</span>
    </div>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<(ADR & { relevance: number })[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchMode, setSearchMode] = useState<'text' | 'semantic'>('text');

  const handleSearch = (q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    setHasSearched(true);
    const found = searchADRs(q);
    // Simulate relevance scoring
    const scored = found.map((adr, i) => ({
      ...adr,
      relevance: Math.max(0.5, 1 - i * 0.12),
    }));
    setResults(scored);
  };

  // Simulate contextual suggestions based on "files being edited"
  const contextualADRs = mockADRs.slice(0, 3);

  return (
    <div className="animate-fade-in max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Search & Discovery</h1>
        <p className="mt-1 text-sm text-muted">
          Find relevant architecture decisions across your team&apos;s knowledge base
        </p>
      </div>

      {/* Search Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search ADRs by keyword, topic, model name, or compliance requirement..."
            className="w-full rounded-xl border border-border bg-card py-4 pl-12 pr-4 text-base text-foreground placeholder:text-muted/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Search Mode Toggle */}
        <div className="flex items-center gap-4">
          <div className="flex rounded-lg border border-border bg-card p-0.5">
            <button
              onClick={() => setSearchMode('text')}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                searchMode === 'text'
                  ? 'bg-primary text-white'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              Text Search
            </button>
            <button
              onClick={() => setSearchMode('semantic')}
              className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                searchMode === 'semantic'
                  ? 'bg-primary text-white'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <Sparkles className="h-3 w-3" />
              Semantic
            </button>
          </div>
          {searchMode === 'semantic' && (
            <span className="text-xs text-muted">
              AI-powered semantic search understands intent, not just keywords
            </span>
          )}
        </div>

        {/* Suggested Queries */}
        {!hasSearched && (
          <div className="flex flex-wrap gap-2">
            {suggestedQueries.map((sq) => (
              <button
                key={sq}
                onClick={() => handleSearch(sq)}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted transition-colors hover:border-primary/30 hover:text-primary"
              >
                {sq}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="space-y-4">
          <p className="text-sm text-muted">
            {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
          </p>

          {results.length > 0 ? (
            <div className="space-y-3">
              {results.map((adr) => (
                <Link
                  key={adr.id}
                  href={`/adrs/${adr.id}`}
                  className="block rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary">
                          ADR-{String(adr.number).padStart(4, '0')}
                        </span>
                        <StatusBadge status={adr.status} />
                        {adr.riskClassification && <RiskBadge risk={adr.riskClassification} />}
                      </div>
                      <h3 className="mt-1.5 text-sm font-semibold text-foreground">{adr.title}</h3>
                      <p className="mt-1.5 line-clamp-2 text-sm text-muted">{adr.context}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {adr.tags.slice(0, 5).map((tag) => (
                          <span
                            key={tag}
                            className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] ${
                              tag.toLowerCase().includes(query.toLowerCase())
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'bg-gray-100 dark:bg-gray-800 text-muted'
                            }`}
                          >
                            <Tag className="h-2.5 w-2.5" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <RelevanceScore score={adr.relevance} />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border py-12 text-center">
              <FileText className="mx-auto h-8 w-8 text-muted" />
              <p className="mt-2 text-sm text-muted">No ADRs found matching your query.</p>
              <p className="mt-1 text-xs text-muted">
                Try different keywords or{' '}
                <Link href="/adrs/new" className="text-primary hover:underline">
                  create a new ADR
                </Link>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Contextual Relevance Section */}
      {!hasSearched && (
        <div className="space-y-6">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold text-foreground">Contextual Suggestions</h2>
            </div>
            <p className="mt-1 text-sm text-muted">
              Based on your recent activity, these ADRs may be relevant:
            </p>
            <div className="mt-4 space-y-2">
              {contextualADRs.map((adr) => (
                <Link
                  key={adr.id}
                  href={`/adrs/${adr.id}`}
                  className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-white/50 dark:hover:bg-gray-800/50"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary/10 text-xs font-bold text-primary">
                    {String(adr.number).padStart(3, '0')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{adr.title}</p>
                    <p className="text-xs text-muted">{adr.authors.join(', ')}</p>
                  </div>
                  <StatusBadge status={adr.status} />
                  <ArrowRight className="h-4 w-4 text-muted" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
