'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Users,
  Tag,
  GitPullRequest,
  FlaskConical,
  Link2,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  FileText,
  Sparkles,
  ArrowRightLeft,
} from 'lucide-react';
import { getADRById, mockADRs } from '@/lib/data';
import StatusBadge from '@/components/StatusBadge';
import RiskBadge from '@/components/RiskBadge';
import QualityScore from '@/components/QualityScore';
import { ADRStatus } from '@/lib/types';

export default function ADRDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const adr = getADRById(id);

  if (!adr) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <FileText className="h-12 w-12 text-muted" />
        <h2 className="mt-4 text-lg font-semibold text-foreground">ADR Not Found</h2>
        <p className="mt-1 text-sm text-muted">The requested ADR does not exist.</p>
        <button
          onClick={() => router.push('/adrs')}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          Back to ADRs
        </button>
      </div>
    );
  }

  const supersededByADR = adr.supersededBy ? getADRById(adr.supersededBy) : null;
  const supersedesADR = adr.supersedes ? getADRById(adr.supersedes) : null;
  const relatedADRs = (adr.relatedADRs || [])
    .map((rid) => mockADRs.find((a) => a.id === rid))
    .filter(Boolean);

  const statusActions: Record<ADRStatus, { label: string; next: ADRStatus }[]> = {
    proposed: [{ label: 'Accept', next: 'accepted' }],
    accepted: [
      { label: 'Deprecate', next: 'deprecated' },
      { label: 'Supersede', next: 'superseded' },
    ],
    deprecated: [],
    superseded: [],
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted">
        <Link href="/adrs" className="hover:text-primary">
          ADRs
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">ADR-{String(adr.number).padStart(4, '0')}</span>
      </div>

      {/* Header */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => router.push('/adrs')}
          className="mt-1 rounded-lg p-1.5 text-muted hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-sm font-bold text-primary">
                  ADR-{String(adr.number).padStart(4, '0')}
                </span>
                <StatusBadge status={adr.status} />
                {adr.riskClassification && <RiskBadge risk={adr.riskClassification} />}
              </div>
              <h1 className="mt-3 text-xl font-bold text-foreground">{adr.title}</h1>
            </div>
            {adr.qualityScore && (
              <div className="text-right shrink-0">
                <p className="text-xs text-muted mb-1">Quality Score</p>
                <QualityScore score={adr.qualityScore} />
              </div>
            )}
          </div>

          {/* Meta */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>Created {adr.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span>{adr.authors.join(', ')}</span>
            </div>
            {adr.modelVersion && (
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                <span>{adr.modelVersion}</span>
              </div>
            )}
            {adr.datasetVersion && (
              <div className="flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                <span>Dataset {adr.datasetVersion}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-2">
            {adr.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs text-muted"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Superseded Banner */}
      {adr.status === 'superseded' && supersededByADR && (
        <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
              This ADR has been superseded by{' '}
              <Link href={`/adrs/${supersededByADR.id}`} className="underline hover:no-underline">
                ADR-{String(supersededByADR.number).padStart(4, '0')}: {supersededByADR.title}
              </Link>
            </span>
          </div>
        </div>
      )}

      {/* Supersedes Banner */}
      {supersedesADR && (
        <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              This ADR supersedes{' '}
              <Link href={`/adrs/${supersedesADR.id}`} className="underline hover:no-underline">
                ADR-{String(supersedesADR.number).padStart(4, '0')}: {supersedesADR.title}
              </Link>
            </span>
          </div>
        </div>
      )}

      {/* Content Sections */}
      <div className="space-y-6">
        {/* Context */}
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold text-foreground">Context</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">{adr.context}</p>
        </section>

        {/* Decision */}
        <section className="rounded-xl border border-primary/20 bg-primary/5 p-6">
          <h2 className="text-base font-semibold text-foreground">Decision</h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground">{adr.decision}</p>
        </section>

        {/* Consequences */}
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold text-foreground">Consequences</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">{adr.consequences}</p>
        </section>

        {/* Alternatives */}
        {adr.alternatives && (
          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-semibold text-foreground">Alternatives Considered</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{adr.alternatives}</p>
          </section>
        )}
      </div>

      {/* Sidebar Info */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Linked PRs & Experiments */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold text-foreground">Links</h3>
          <div className="mt-4 space-y-3">
            {adr.linkedPRs && adr.linkedPRs.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted mb-2">Pull Requests</p>
                <div className="space-y-1.5">
                  {adr.linkedPRs.map((pr) => (
                    <div key={pr} className="flex items-center gap-2 text-sm text-primary">
                      <GitPullRequest className="h-3.5 w-3.5" />
                      <span>{pr}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {adr.linkedExperiments && adr.linkedExperiments.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted mb-2">Experiments</p>
                <div className="space-y-1.5">
                  {adr.linkedExperiments.map((exp) => (
                    <div key={exp} className="flex items-center gap-2 text-sm text-accent">
                      <FlaskConical className="h-3.5 w-3.5" />
                      <span>{exp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {(!adr.linkedPRs || adr.linkedPRs.length === 0) &&
              (!adr.linkedExperiments || adr.linkedExperiments.length === 0) && (
                <p className="text-xs text-muted">No linked resources</p>
              )}
          </div>
        </div>

        {/* Compliance */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold text-foreground">Compliance & Governance</h3>
          <div className="mt-4 space-y-3">
            {adr.complianceFrameworks && adr.complianceFrameworks.length > 0 ? (
              <div className="space-y-2">
                {adr.complianceFrameworks.map((fw) => (
                  <div key={fw} className="flex items-center gap-2 text-sm">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    <span className="text-foreground">{fw}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted">No compliance frameworks specified</p>
            )}
          </div>
        </div>
      </div>

      {/* Related ADRs */}
      {relatedADRs.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold text-foreground">Related Decisions</h3>
          <div className="mt-4 space-y-2">
            {relatedADRs.map((related) => related && (
              <Link
                key={related.id}
                href={`/adrs/${related.id}`}
                className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <Link2 className="h-4 w-4 text-muted" />
                <span className="text-sm font-medium text-primary">
                  ADR-{String(related.number).padStart(4, '0')}
                </span>
                <span className="text-sm text-foreground">{related.title}</span>
                <StatusBadge status={related.status} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Status Actions */}
      {statusActions[adr.status].length > 0 && (
        <div className="flex items-center gap-3 border-t border-border pt-6">
          <span className="text-sm text-muted">Lifecycle Actions:</span>
          {statusActions[adr.status].map((action) => (
            <button
              key={action.label}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
