'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertCircle, LoaderCircle } from 'lucide-react';

export function DocxReader({ src, title }: { src: string; title: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    if (!container) return;

    container.replaceChildren();
    setState('loading');

    async function renderDocument() {
      try {
        const [response, docx] = await Promise.all([
          fetch(src),
          import('docx-preview'),
        ]);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const blob = await response.blob();
        if (cancelled || !container) return;
        await docx.renderAsync(blob, container, container, {
          breakPages: true,
          ignoreLastRenderedPageBreak: false,
          renderHeaders: true,
          renderFooters: true,
          renderFootnotes: true,
          renderEndnotes: true,
          useBase64URL: true,
          experimental: true,
          debug: false,
        });
        if (!cancelled) setState('ready');
      } catch (error) {
        console.error('DOCX render failed', error);
        if (!cancelled) setState('error');
      }
    }

    renderDocument();
    return () => {
      cancelled = true;
    };
  }, [src]);

  return (
    <div className="docx-reader relative min-h-[70vh]" aria-label={`${title}原文`}>
      {state === 'loading' && (
        <div className="absolute inset-x-0 top-16 z-10 mx-auto flex w-fit items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm text-muted-foreground shadow-sm">
          <LoaderCircle className="size-4 animate-spin" />正在排版 Word 原文…
        </div>
      )}
      {state === 'error' && (
        <div className="mx-auto mt-14 flex max-w-md items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-5 text-sm">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
          <p>在线排版暂时没有完成。可使用上方“下载原文”在 Word 中打开，全部公式、图片和表格均保留在原文件中。</p>
        </div>
      )}
      <div className="docx-stage" ref={containerRef} />
    </div>
  );
}
