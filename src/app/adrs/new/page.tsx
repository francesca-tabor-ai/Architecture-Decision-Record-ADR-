'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  FileText,
  Loader2,
  ChevronRight,
  Wand2,
  MessageSquare,
  Code,
  BookTemplate,
  Tag,
  ShieldCheck,
} from 'lucide-react';
import { templates } from '@/lib/data';
import { ADRCategory, ComplianceFramework } from '@/lib/types';
import Link from 'next/link';

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

const aiSources = [
  { id: 'natural', label: 'Natural Language', icon: MessageSquare, description: 'Describe your decision in plain text' },
  { id: 'code', label: 'Code Change', icon: Code, description: 'Generate from a PR or diff' },
  { id: 'template', label: 'From Template', icon: BookTemplate, description: 'Start with an AI-specific template' },
];

export default function NewADRPage() {
  const router = useRouter();
  const [step, setStep] = useState<'source' | 'input' | 'edit'>('source');
  const [sourceType, setSourceType] = useState<string>('natural');
  const [aiInput, setAiInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ADRCategory>('general');
  const [context, setContext] = useState('');
  const [decision, setDecision] = useState('');
  const [consequences, setConsequences] = useState('');
  const [alternatives, setAlternatives] = useState('');
  const [tags, setTags] = useState('');
  const [compliance, setCompliance] = useState<ComplianceFramework[]>([]);
  const [riskLevel, setRiskLevel] = useState<string>('medium');

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      if (sourceType === 'template' && selectedTemplate) {
        const tpl = templates.find((t) => t.id === selectedTemplate);
        if (tpl) {
          setTitle(`[Generated] ${tpl.name}`);
          setCategory(tpl.category);
          setContext(tpl.fields.context);
          setDecision(tpl.fields.decision);
          setConsequences(tpl.fields.consequences);
          setAlternatives(tpl.fields.alternatives);
          setTags(tpl.tags.join(', '));
        }
      } else if (sourceType === 'natural' && aiInput) {
        setTitle(`[AI Draft] Decision: ${aiInput.slice(0, 60)}...`);
        setContext(
          `Based on the input: "${aiInput}"\n\nOur team needs to make an architectural decision regarding this topic. The current system requires changes to support the described requirements. Key constraints include performance, maintainability, and team expertise.`
        );
        setDecision(
          `In the context of the described requirements, facing the need for [specific constraint], we decided for [chosen approach] and against [alternatives], to achieve [desired outcome], accepting [trade-offs].`
        );
        setConsequences(
          'Positive: [Expected benefits from the decision].\n\nNegative: [Known drawbacks and risks].\n\nNeutral: [Side effects that need monitoring].'
        );
        setAlternatives(
          'Alternative 1: [Description and evaluation]\nAlternative 2: [Description and evaluation]'
        );
      } else if (sourceType === 'code') {
        setTitle('[AI Draft] Architecture change detected in PR');
        setContext(
          'Code changes detected in the pull request suggest an architectural modification. The changes affect [components/services] and introduce [new patterns/dependencies].'
        );
        setDecision(
          'Based on the code changes, the decision is to [extracted decision]. This modifies the existing architecture by [change description].'
        );
        setConsequences(
          'Positive: [Inferred benefits from code changes].\n\nNegative: [Potential issues identified].\n\nRisks: [Risks detected from the changes].'
        );
      }
      setIsGenerating(false);
      setStep('edit');
    }, 2000);
  };

  const handleSave = () => {
    // In a real app, this would save to the backend
    router.push('/adrs');
  };

  return (
    <div className="animate-fade-in max-w-4xl space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted">
        <Link href="/adrs" className="hover:text-primary">ADRs</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">New ADR</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Create New ADR</h1>
          <p className="text-sm text-muted">AI-assisted architecture decision authoring</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        {['source', 'input', 'edit'].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
                step === s
                  ? 'bg-primary text-white'
                  : ['source', 'input', 'edit'].indexOf(step) > i
                  ? 'bg-primary/20 text-primary'
                  : 'bg-gray-200 dark:bg-gray-700 text-muted'
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`text-sm ${
                step === s ? 'font-medium text-foreground' : 'text-muted'
              }`}
            >
              {s === 'source' ? 'Choose Source' : s === 'input' ? 'Provide Input' : 'Review & Edit'}
            </span>
            {i < 2 && <ChevronRight className="h-4 w-4 text-muted mx-1" />}
          </div>
        ))}
      </div>

      {/* Step 1: Source Selection */}
      {step === 'source' && (
        <div className="space-y-4">
          <p className="text-sm text-muted">How would you like to create this ADR?</p>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {aiSources.map((source) => {
              const Icon = source.icon;
              return (
                <button
                  key={source.id}
                  onClick={() => {
                    setSourceType(source.id);
                    setStep('input');
                  }}
                  className={`rounded-xl border-2 p-6 text-left transition-all hover:border-primary/50 hover:shadow-md ${
                    sourceType === source.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-card'
                  }`}
                >
                  <Icon className="h-8 w-8 text-primary" />
                  <h3 className="mt-3 text-sm font-semibold text-foreground">{source.label}</h3>
                  <p className="mt-1 text-xs text-muted">{source.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 2: Input */}
      {step === 'input' && (
        <div className="space-y-4">
          {sourceType === 'natural' && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-sm font-semibold text-foreground">Describe your architecture decision</h3>
              <p className="mt-1 text-xs text-muted">
                Write in natural language. The AI will generate a structured ADR draft.
              </p>
              <textarea
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="e.g., We need to decide on a vector database for our RAG pipeline. We're considering ChromaDB, Pinecone, and Weaviate. Our main requirements are low latency, metadata filtering, and easy local development..."
                rows={6}
                className="mt-3 w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          )}

          {sourceType === 'code' && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-sm font-semibold text-foreground">Paste PR URL or diff</h3>
              <p className="mt-1 text-xs text-muted">
                Provide a GitHub PR URL or paste a code diff. The AI will extract the architectural decision.
              </p>
              <textarea
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Paste a GitHub PR URL (e.g., github.com/org/repo/pull/123) or a code diff..."
                rows={6}
                className="mt-3 w-full rounded-lg border border-border bg-background p-3 font-mono text-sm text-foreground placeholder:text-muted/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          )}

          {sourceType === 'template' && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Choose a template</h3>
              <p className="text-xs text-muted">AI-specific templates pre-populated with relevant structure.</p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {templates.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl.id)}
                    className={`rounded-xl border-2 p-5 text-left transition-all ${
                      selectedTemplate === tpl.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-card hover:border-primary/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <BookTemplate className="h-4 w-4 text-primary" />
                      <h4 className="text-sm font-semibold text-foreground">{tpl.name}</h4>
                    </div>
                    <p className="mt-1.5 text-xs text-muted">{tpl.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {tpl.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[10px] text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={() => setStep('source')}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Back
            </button>
            <button
              onClick={handleGenerate}
              disabled={
                isGenerating ||
                (sourceType === 'template' && !selectedTemplate) ||
                (sourceType !== 'template' && !aiInput.trim())
              }
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  Generate ADR Draft
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Edit */}
      {step === 'edit' && (
        <div className="space-y-5">
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-primary">
                AI-generated draft — review and edit before saving
              </span>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Category & Risk */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ADRCategory)}
                className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Risk Classification</label>
              <select
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Context */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Context</label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={5}
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Decision */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Decision
              <span className="ml-2 text-xs text-muted font-normal">(Y-Statement format recommended)</span>
            </label>
            <textarea
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              rows={5}
              className="w-full rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Consequences */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Consequences</label>
            <textarea
              value={consequences}
              onChange={(e) => setConsequences(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Alternatives */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Alternatives Considered</label>
            <textarea
              value={alternatives}
              onChange={(e) => setAlternatives(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              <Tag className="inline h-3.5 w-3.5 mr-1" />
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="llm, inference, production"
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          {/* Compliance Frameworks */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              <ShieldCheck className="inline h-3.5 w-3.5 mr-1" />
              Compliance Frameworks
            </label>
            <div className="flex flex-wrap gap-2">
              {(['GDPR', 'EU AI Act', 'SOC2', 'HIPAA', 'Model Governance'] as ComplianceFramework[]).map(
                (fw) => (
                  <button
                    key={fw}
                    onClick={() =>
                      setCompliance((prev) =>
                        prev.includes(fw) ? prev.filter((f) => f !== fw) : [...prev, fw]
                      )
                    }
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                      compliance.includes(fw)
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted hover:border-primary/30'
                    }`}
                  >
                    {fw}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 border-t border-border pt-5">
            <button
              onClick={() => setStep('input')}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Back
            </button>
            <button
              onClick={handleGenerate}
              className="flex items-center gap-2 rounded-lg border border-primary/30 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/5"
            >
              <Wand2 className="h-4 w-4" />
              Regenerate
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
            >
              <FileText className="h-4 w-4" />
              Save ADR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
