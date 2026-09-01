'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookMarked,
  BookOpenText,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FileSearch,
  FileText,
  Library,
  Menu,
  Search,
  Sigma,
  Sparkles,
  X,
} from 'lucide-react';

import { papers, type Paper } from '@/app/papers';
import { DocxReader } from '@/components/docx-reader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

type SearchSection = { page?: number; part?: number; text: string };
type SearchDocument = { slug: string; title: string; sections: SearchSection[] };
type SearchResult = { slug: string; title: string; page?: number; snippet: string };

function normalize(value: string) {
  return value.toLocaleLowerCase().replace(/\s+/g, ' ').trim();
}

function snippetAround(text: string, query: string) {
  const compact = text.replace(/\s+/g, ' ').trim();
  const index = normalize(compact).indexOf(normalize(query));
  if (index < 0) return compact.slice(0, 132);
  const start = Math.max(0, index - 54);
  const end = Math.min(compact.length, index + query.length + 78);
  return `${start ? '…' : ''}${compact.slice(start, end)}${end < compact.length ? '…' : ''}`;
}

function PaperGlyph({ paper }: { paper: Paper }) {
  if (paper.cover) {
    return (
      <img
        alt={`${paper.shortTitle}首页预览`}
        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.025]"
        loading="lazy"
        src={paper.cover}
      />
    );
  }
  return (
    <div className="flex h-full flex-col justify-between bg-[linear-gradient(145deg,var(--paper-deep),var(--paper-mid))] p-5 text-white">
      <div className="flex items-center justify-between text-[10px] tracking-[0.16em] text-white/60">
        <span>RESEARCH PAPER</span>
        <Sigma className="size-4" />
      </div>
      <div>
        <div className="mb-4 h-px w-10 bg-white/35" />
        <p className="font-serif text-xl font-semibold leading-8">{paper.shortTitle}</p>
        <p className="mt-3 text-xs text-white/60">{paper.year} · {paper.language}</p>
      </div>
    </div>
  );
}

export function PaperCollection() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [mode, setMode] = useState<'guide' | 'reader'>('guide');
  const [pdfPage, setPdfPage] = useState(1);
  const [query, setQuery] = useState('');
  const [searchIndex, setSearchIndex] = useState<SearchDocument[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const selectedPaper = papers.find((paper) => paper.slug === selectedSlug) ?? null;

  useEffect(() => {
    const readHash = () => {
      const match = window.location.hash.match(/^#\/paper\/([^/]+)(?:\/(read)(?:\/(\d+))?)?/);
      if (!match || !papers.some((paper) => paper.slug === match[1])) return;
      setSelectedSlug(match[1]);
      setMode(match[2] ? 'reader' : 'guide');
      if (match[3]) setPdfPage(Number(match[3]));
    };
    readHash();
    window.addEventListener('hashchange', readHash);
    return () => window.removeEventListener('hashchange', readHash);
  }, []);

  useEffect(() => {
    if (!query.trim() || searchIndex || searchLoading) return;
    setSearchLoading(true);
    fetch('/search/index.json')
      .then((response) => response.json() as Promise<SearchDocument[]>)
      .then((data) => setSearchIndex(data))
      .catch(() => setSearchIndex([]))
      .finally(() => setSearchLoading(false));
  }, [query, searchIndex, searchLoading]);

  useEffect(() => {
    document.title = selectedPaper
      ? `${selectedPaper.shortTitle}｜王毅乐 · 个人论文集`
      : '王毅乐 · 个人论文集';
  }, [selectedPaper]);

  const results = useMemo<SearchResult[]>(() => {
    const term = query.trim();
    if (!term) return [];
    const normalizedTerm = normalize(term);
    const hits: SearchResult[] = [];

    for (const paper of papers) {
      const metadata = normalize([
        paper.title,
        paper.originalTitle,
        paper.authors,
        paper.category,
        paper.keywords.join(' '),
        paper.abstract,
      ].join(' '));
      if (metadata.includes(normalizedTerm)) {
        hits.push({ slug: paper.slug, title: paper.title, snippet: snippetAround(paper.abstract, term) });
      }
    }

    for (const document of searchIndex ?? []) {
      for (const section of document.sections) {
        if (!normalize(section.text).includes(normalizedTerm)) continue;
        hits.push({
          slug: document.slug,
          title: document.title,
          page: section.page,
          snippet: snippetAround(section.text, term),
        });
        if (hits.filter((hit) => hit.slug === document.slug).length >= 3) break;
      }
    }
    return hits.slice(0, 12);
  }, [query, searchIndex]);

  function updateLocation(paper: Paper | null, nextMode: 'guide' | 'reader' = 'guide', page = 1) {
    if (!paper) {
      window.history.pushState(null, '', window.location.pathname);
      setSelectedSlug(null);
      setMode('guide');
    } else {
      const hash = nextMode === 'reader'
        ? `#/paper/${paper.slug}/read${paper.type === 'pdf' ? `/${page}` : ''}`
        : `#/paper/${paper.slug}`;
      window.history.pushState(null, '', hash);
      setSelectedSlug(paper.slug);
      setMode(nextMode);
      setPdfPage(page);
    }
    setQuery('');
    setMobileOpen(false);
    setMobileSearch(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openSearchResult(result: SearchResult) {
    const paper = papers.find((item) => item.slug === result.slug);
    if (!paper) return;
    updateLocation(paper, result.page ? 'reader' : 'guide', result.page ?? 1);
  }

  function openSection(paper: Paper, page?: number) {
    updateLocation(paper, 'reader', page ?? 1);
  }

  const nav = (
    <nav aria-label="论文集目录" className="px-3 pb-8 pt-3">
      <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground">开始阅读</p>
      <button
        className={`nav-row ${!selectedPaper ? 'nav-row-active' : ''}`}
        onClick={() => updateLocation(null)}
        type="button"
      >
        <BookOpenText className="size-4" />
        <span>论文集首页</span>
      </button>

      <p className="mb-2 mt-7 px-3 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground">论文目录</p>
      <div className="space-y-1">
        {papers.map((paper) => {
          const active = paper.slug === selectedSlug;
          return (
            <div key={paper.slug}>
              <button
                className={`nav-paper ${active ? 'nav-paper-active' : ''}`}
                onClick={() => updateLocation(paper)}
                type="button"
              >
                <span className="nav-number">{paper.order}</span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block text-[13px] font-medium leading-5">{paper.shortTitle}</span>
                  <span className="mt-0.5 block text-[10px] text-muted-foreground">{paper.year} · {paper.category.split(' / ')[0]}</span>
                </span>
              </button>
              {active && (
                <div className="ml-[27px] border-l border-primary/20 py-1 pl-3">
                  <button className={`nav-subrow ${mode === 'guide' ? 'text-primary' : ''}`} onClick={() => updateLocation(paper)} type="button">导读与摘要</button>
                  <button className={`nav-subrow ${mode === 'reader' ? 'text-primary' : ''}`} onClick={() => openSection(paper, 1)} type="button">阅读完整原文</button>
                  {paper.sections.slice(0, 5).map((section) => (
                    <button className="nav-subrow" key={section.title} onClick={() => openSection(paper, section.page)} type="button">{section.title}</button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );

  const searchBox = (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        aria-label="全文搜索"
        autoComplete="off"
        className="h-9 rounded-xl border-border/90 bg-muted/55 pl-9 pr-9 shadow-none"
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setQuery('');
          if (event.key === 'Enter' && results[0]) openSearchResult(results[0]);
        }}
        placeholder="全文搜索论文、公式说明或关键词…"
        value={query}
      />
      {query && (
        <button aria-label="清除搜索" className="absolute right-2 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-muted" onClick={() => setQuery('')} type="button">
          <X className="size-3.5" />
        </button>
      )}
      {query && (
        <div className="absolute left-0 right-0 top-11 z-50 max-h-[min(70vh,540px)] overflow-y-auto rounded-2xl border border-border bg-popover p-2 text-popover-foreground shadow-[0_24px_70px_rgba(24,28,23,0.18)]">
          <div className="flex items-center justify-between px-3 py-2 text-[11px] text-muted-foreground">
            <span>{searchLoading ? '正在建立全文索引…' : `${results.length} 条匹配结果`}</span>
            <span>回车打开首条</span>
          </div>
          {!searchLoading && !results.length && (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">未找到相关内容，请尝试更短的关键词。</div>
          )}
          {results.map((result, index) => (
            <button className="w-full rounded-xl px-3 py-3 text-left transition-colors hover:bg-muted" key={`${result.slug}-${result.page ?? 'meta'}-${index}`} onClick={() => openSearchResult(result)} type="button">
              <div className="flex items-center gap-2 text-xs font-medium"><FileSearch className="size-3.5 text-primary" /><span className="line-clamp-1">{result.title}</span>{result.page && <span className="ml-auto shrink-0 text-[10px] text-muted-foreground">第 {result.page} 页</span>}</div>
              <p className="mt-1.5 line-clamp-2 text-[11px] leading-5 text-muted-foreground">{result.snippet}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 flex h-16 items-center border-b border-border/80 bg-background/90 px-3 backdrop-blur-xl sm:px-5 md:px-6">
        <div className="flex min-w-0 items-center gap-2 md:w-[278px]">
          <Sheet onOpenChange={setMobileOpen} open={mobileOpen}>
            <SheetTrigger render={<Button aria-label="打开目录" className="md:hidden" size="icon" variant="ghost" />}>
              <Menu />
            </SheetTrigger>
            <SheetContent className="w-[88vw] max-w-[340px] gap-0 overflow-y-auto bg-sidebar p-0" side="left">
              <SheetHeader className="border-b px-5 py-5 text-left">
                <SheetTitle className="font-serif">王毅乐 · 个人论文集</SheetTitle>
                <SheetDescription>经济、环境与区域发展研究</SheetDescription>
              </SheetHeader>
              {nav}
            </SheetContent>
          </Sheet>
          <button className="flex min-w-0 items-center gap-3 rounded-xl text-left" onClick={() => updateLocation(null)} type="button">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm"><Library className="size-[18px]" /></span>
            <span className="hidden min-w-0 sm:block">
              <span className="block truncate font-serif text-[15px] font-semibold tracking-wide">王毅乐 · 个人论文集</span>
              <span className="block text-[9px] tracking-[0.15em] text-muted-foreground">RESEARCH COLLECTION</span>
            </span>
          </button>
        </div>
        <div className="mx-auto hidden w-full max-w-lg md:block">{searchBox}</div>
        <div className="ml-auto flex items-center justify-end gap-1 md:w-[278px]">
          <Button aria-label="搜索" className="md:hidden" onClick={() => setMobileSearch((value) => !value)} size="icon" variant="ghost"><Search /></Button>
          <span className="hidden text-xs text-muted-foreground lg:block">6 篇论文 · 117 页</span>
        </div>
        {mobileSearch && <div className="absolute inset-x-3 top-[70px] z-50 md:hidden">{searchBox}</div>}
      </header>

      <div className="mx-auto grid max-w-[1640px] md:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] overflow-y-auto border-r border-border/80 bg-sidebar/55 md:block">{nav}</aside>
        <div className="min-w-0">
          {!selectedPaper ? (
            <CollectionHome onOpen={(paper) => updateLocation(paper)} />
          ) : mode === 'guide' ? (
            <PaperGuide onRead={(page) => openSection(selectedPaper, page)} paper={selectedPaper} />
          ) : (
            <PaperReader
              onBack={() => updateLocation(selectedPaper)}
              onPageChange={(page) => {
                setPdfPage(page);
                window.history.replaceState(null, '', `#/paper/${selectedPaper.slug}/read/${page}`);
              }}
              page={pdfPage}
              paper={selectedPaper}
            />
          )}
        </div>
      </div>
    </main>
  );
}

function CollectionHome({ onOpen }: { onOpen: (paper: Paper) => void }) {
  return (
    <section className="relative overflow-hidden px-5 py-10 sm:px-8 lg:px-12 xl:px-16 xl:py-16">
      <div className="pointer-events-none absolute -right-28 -top-28 size-[430px] rounded-full bg-[radial-gradient(circle,var(--glow)_0%,transparent_68%)]" />
      <div className="relative mx-auto max-w-6xl">
        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_310px]">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/[0.055] px-3 py-1.5 text-xs font-medium text-primary"><Sparkles className="size-3.5" />经济、环境与区域发展研究</div>
            <h1 className="font-serif text-[clamp(2.55rem,6vw,5.4rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-balance">以数据与模型，<br />记录发展轨迹。</h1>
            <p className="mt-6 max-w-2xl text-[15px] leading-7 text-muted-foreground sm:text-base">这是一部可检索、可连续阅读的个人研究典藏。内容覆盖现代化测度、IPO 定价、国际贸易、数字经济、碳排放、绿色生产率与区域韧性；原文中的全部公式、图片、表格和参考文献均按原始文件保留。</p>
          </div>
          <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_16px_50px_rgba(44,40,30,0.06)] lg:grid-cols-1">
            {([['06', '篇研究成果'], ['117', '页完整原文'], ['2020–26', '研究时间线']] as const).map(([value, label], index) => (
              <div className={`px-4 py-4 lg:flex lg:items-baseline lg:justify-between lg:px-6 ${index ? 'border-l border-border/80 lg:border-l-0 lg:border-t' : ''}`} key={label}>
                <p className="font-serif text-xl font-semibold text-primary sm:text-2xl">{value}</p><p className="mt-1 text-[10px] text-muted-foreground sm:text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-5 mt-14 flex items-end justify-between gap-4">
          <div><p className="text-[10px] font-semibold tracking-[0.18em] text-primary">COLLECTION</p><h2 className="mt-1 font-serif text-2xl font-semibold">论文典藏</h2></div>
          <span className="hidden text-xs text-muted-foreground sm:block">点击论文查看导读与完整原文</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {papers.map((paper) => (
            <button className="paper-card group text-left" key={paper.slug} onClick={() => onOpen(paper)} type="button">
              <div className="paper-cover"><PaperGlyph paper={paper} /></div>
              <div className="flex min-h-[178px] flex-col p-5">
                <div className="flex items-center justify-between text-[10px] tracking-[0.08em] text-muted-foreground"><span>{paper.order} / 06</span><span>{paper.year} · {paper.pages} 页</span></div>
                <h3 className="mt-4 font-serif text-[17px] font-semibold leading-6 text-card-foreground">{paper.title}</h3>
                <p className="mt-2 line-clamp-1 text-[11px] text-muted-foreground">{paper.authors}</p>
                <div className="mt-auto flex items-center justify-between pt-5"><span className="text-xs text-primary">{paper.category}</span><ArrowRight className="size-4 text-primary/60 transition-transform group-hover:translate-x-1" /></div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-12 flex items-center gap-4 border-t border-border/80 pt-6 text-xs leading-5 text-muted-foreground"><BookMarked className="size-5 shrink-0 text-primary" /><p>阅读提示：PDF 论文使用原生矢量阅读器呈现；Word 论文在网页中按纸张版式重新排版。也可随时下载原始文件离线阅读。</p></div>
      </div>
    </section>
  );
}

function PaperGuide({ paper, onRead }: { paper: Paper; onRead: (page?: number) => void }) {
  return (
    <section className="px-5 py-8 sm:px-8 lg:px-12 xl:px-14 xl:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center gap-2 text-xs text-muted-foreground"><Library className="size-3.5" /><span>个人论文集</span><ChevronRight className="size-3" /><span className="text-foreground">第 {paper.order} 篇</span></div>
        <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_270px]">
          <article className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center gap-2 text-[11px]"><span className="rounded-full bg-primary/10 px-3 py-1.5 font-medium text-primary">{paper.category}</span><span className="rounded-full border px-3 py-1.5 text-muted-foreground">{paper.year}</span><span className="rounded-full border px-3 py-1.5 text-muted-foreground">{paper.language}</span></div>
            <h1 className="max-w-4xl font-serif text-[clamp(2rem,4.4vw,4rem)] font-semibold leading-[1.16] tracking-[-0.03em] text-balance">{paper.title}</h1>
            <p className="mt-5 max-w-4xl font-serif text-base leading-7 text-muted-foreground/90">{paper.originalTitle}</p>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-border/80 py-4 text-xs text-muted-foreground"><span className="font-medium text-foreground">{paper.authors}</span><span>{paper.venue}</span><span>{paper.pages} 页</span></div>

            <div className="mt-9 rounded-3xl border border-primary/15 bg-[linear-gradient(145deg,var(--guide-start),var(--guide-end))] p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-2 text-xs font-semibold tracking-[0.12em] text-primary"><FileText className="size-4" />论文导读</div>
              <p className="font-serif text-[17px] leading-8 text-foreground/90 sm:text-lg">{paper.abstract}</p>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              <div>
                <h2 className="section-title"><Sigma className="size-4 text-primary" />研究方法</h2>
                <div className="mt-4 space-y-3">
                  {paper.methods.map((method, index) => <div className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3 text-sm" key={method}><span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/8 font-mono text-[10px] text-primary">{index + 1}</span>{method}</div>)}
                </div>
              </div>
              <div>
                <h2 className="section-title"><CheckCircle2 className="size-4 text-primary" />核心发现</h2>
                <div className="mt-4 space-y-3">
                  {paper.findings.map((finding) => <div className="flex items-start gap-3 rounded-xl border bg-card px-4 py-3 text-sm leading-6" key={finding}><CheckCircle2 className="mt-1 size-3.5 shrink-0 text-primary" /><span>{finding}</span></div>)}
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="section-title"><BookOpenText className="size-4 text-primary" />关键词</h2>
              <div className="mt-4 flex flex-wrap gap-2">{paper.keywords.map((keyword) => <span className="rounded-full border bg-card px-3 py-1.5 text-xs text-muted-foreground" key={keyword}>{keyword}</span>)}</div>
            </div>

            <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-3xl bg-primary px-6 py-7 text-primary-foreground sm:flex-row sm:items-center sm:px-8">
              <div><h2 className="font-serif text-xl font-semibold">阅读完整论文</h2><p className="mt-1 text-sm text-primary-foreground/70">原始版式 · 公式、图片、表格完整保留</p></div>
              <Button className="h-10 bg-white px-4 text-primary hover:bg-white/90" onClick={() => onRead(1)}><BookOpenText />开始阅读<ArrowRight /></Button>
            </div>
          </article>

          <aside className="hidden xl:block">
            <div className="sticky top-24 rounded-2xl border bg-card p-5 shadow-[0_8px_28px_rgba(44,40,30,0.04)]">
              <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground">本篇目录</p>
              <div className="mt-4 space-y-1">
                {paper.sections.map((section, index) => (
                  <button className="flex w-full items-start gap-3 rounded-lg px-2 py-2 text-left text-xs leading-5 text-muted-foreground hover:bg-muted hover:text-foreground" key={section.title} onClick={() => onRead(section.page)} type="button"><span className="font-mono text-[9px] text-primary/65">{String(index + 1).padStart(2, '0')}</span><span>{section.title}</span>{section.page && <span className="ml-auto text-[9px]">{section.page}</span>}</button>
                ))}
              </div>
              <div className="mt-5 border-t pt-4 text-[11px] leading-5 text-muted-foreground">全文可通过顶部搜索框检索；PDF 搜索结果可直接跳转到对应页面。</div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function PaperReader({ paper, page, onPageChange, onBack }: { paper: Paper; page: number; onPageChange: (page: number) => void; onBack: () => void }) {
  return (
    <section className="min-h-[calc(100vh-4rem)] bg-[var(--reader-bg)]">
      <div className="sticky top-16 z-30 flex min-h-14 flex-wrap items-center gap-2 border-b border-border/80 bg-background/92 px-3 py-2 backdrop-blur-xl sm:px-5">
        <Button aria-label="返回导读" onClick={onBack} size="icon" variant="ghost"><ArrowLeft /></Button>
        <div className="min-w-0 flex-1"><p className="truncate text-xs font-medium sm:text-sm">{paper.shortTitle}</p><p className="hidden text-[10px] text-muted-foreground sm:block">完整原文 · {paper.type.toUpperCase()}</p></div>
        {paper.type === 'pdf' && (
          <div className="flex items-center gap-1 rounded-xl border bg-card p-1">
            <Button aria-label="上一页" disabled={page <= 1} onClick={() => onPageChange(Math.max(1, page - 1))} size="icon-sm" variant="ghost"><ChevronLeft /></Button>
            <label className="flex items-center gap-1 text-[11px] text-muted-foreground"><span className="sr-only">当前页</span><input className="h-7 w-10 rounded-md border bg-background text-center text-xs text-foreground outline-none focus:border-primary" max={paper.pages} min={1} onChange={(event) => onPageChange(Math.min(paper.pages, Math.max(1, Number(event.target.value) || 1)))} type="number" value={page} />/ {paper.pages}</label>
            <Button aria-label="下一页" disabled={page >= paper.pages} onClick={() => onPageChange(Math.min(paper.pages, page + 1))} size="icon-sm" variant="ghost"><ChevronRight /></Button>
          </div>
        )}
        <a className="reader-action" download href={paper.file}><Download className="size-3.5" /><span className="hidden sm:inline">下载原文</span></a>
        <a className="reader-action" href={paper.file} rel="noreferrer" target="_blank"><ExternalLink className="size-3.5" /><span className="hidden sm:inline">新窗口</span></a>
      </div>

      {paper.type === 'pdf' ? (
        <iframe className="block h-[calc(100vh-7.5rem)] w-full border-0 bg-white" key={`${paper.slug}-${page}`} src={`${paper.file}#page=${page}&view=FitH&toolbar=1`} title={`${paper.title}完整原文`} />
      ) : (
        <div className="overflow-x-auto px-2 py-6 sm:px-6"><DocxReader src={paper.file} title={paper.title} /></div>
      )}
    </section>
  );
}
