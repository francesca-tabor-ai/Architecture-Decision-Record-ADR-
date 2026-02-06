'use client';

import Link from 'next/link';
import {
  BookTemplate,
  Brain,
  Database,
  Server,
  MessageSquare,
  Layers,
  BarChart3,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { templates } from '@/lib/data';
import { ADRCategory } from '@/lib/types';

const categoryIcons: Record<ADRCategory, React.ReactNode> = {
  'model-selection': <Brain className="h-6 w-6" />,
  'data-pipeline': <Database className="h-6 w-6" />,
  'infrastructure': <Server className="h-6 w-6" />,
  'evaluation': <BarChart3 className="h-6 w-6" />,
  'prompt-architecture': <MessageSquare className="h-6 w-6" />,
  'rag-architecture': <Layers className="h-6 w-6" />,
  'feature-store': <Database className="h-6 w-6" />,
  'inference-serving': <Server className="h-6 w-6" />,
  'data-retention': <Database className="h-6 w-6" />,
  'security': <Server className="h-6 w-6" />,
  'compliance': <Server className="h-6 w-6" />,
  'general': <BookTemplate className="h-6 w-6" />,
};

const categoryColors: Record<string, string> = {
  'model-selection': 'from-violet-500 to-purple-600',
  'data-retention': 'from-emerald-500 to-teal-600',
  'rag-architecture': 'from-blue-500 to-indigo-600',
  'inference-serving': 'from-orange-500 to-red-600',
  'prompt-architecture': 'from-pink-500 to-rose-600',
  'feature-store': 'from-cyan-500 to-blue-600',
};

export default function TemplatesPage() {
  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Decision Templates</h1>
          <p className="mt-1 text-sm text-muted">
            AI-specific templates for common architecture decisions in ML/AI systems
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">{templates.length} templates</span>
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((tpl) => {
          const gradient = categoryColors[tpl.category] || 'from-gray-500 to-slate-600';
          return (
            <div
              key={tpl.id}
              className="group rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg"
            >
              {/* Color Bar */}
              <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />

              <div className="p-6">
                {/* Icon & Category */}
                <div className="flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white`}>
                    {categoryIcons[tpl.category]}
                  </div>
                </div>

                {/* Content */}
                <h3 className="mt-4 text-base font-semibold text-foreground">{tpl.name}</h3>
                <p className="mt-1.5 text-sm text-muted line-clamp-2">{tpl.description}</p>

                {/* Tags */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {tpl.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[10px] text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Template Preview */}
                <div className="mt-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3">
                  <p className="text-xs font-medium text-muted mb-1">Decision Template:</p>
                  <p className="text-xs text-muted line-clamp-3 italic">
                    &ldquo;{tpl.fields.decision}&rdquo;
                  </p>
                </div>

                {/* Action */}
                <Link
                  href="/adrs/new"
                  className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary-dark group-hover:gap-2.5"
                >
                  Use Template
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Template CTA */}
      <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-8 text-center">
        <BookTemplate className="mx-auto h-10 w-10 text-primary" />
        <h3 className="mt-3 text-base font-semibold text-foreground">Need a Custom Template?</h3>
        <p className="mt-1 text-sm text-muted max-w-md mx-auto">
          Create custom templates tailored to your team&apos;s specific architecture domains and decision patterns.
        </p>
        <button className="mt-4 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-dark">
          Create Custom Template
        </button>
      </div>
    </div>
  );
}
