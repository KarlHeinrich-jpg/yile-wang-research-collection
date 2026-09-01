import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import JSZip from 'jszip';

const documents = [
  {
    slug: 'hybrid-pca-stacking',
    title: '中国现代化进程的多维评估：混合 PCA–Stacking 框架',
    type: 'pdf',
    path: 'public/documents/hybrid-pca-stacking.pdf',
  },
  {
    slug: 'ipo-pricing-dml',
    title: '基于双重机器学习的投资者情绪对 IPO 定价效率影响研究',
    type: 'docx',
    path: 'public/documents/ipo-pricing-dml.docx',
  },
  {
    slug: 'reciprocal-tariffs-apmcm',
    title: '2025 年美国“对等关税”政策的多层量化评估',
    type: 'pdf',
    path: 'public/documents/reciprocal-tariffs-apmcm.pdf',
  },
  {
    slug: 'digital-economy-carbon-emissions',
    title: '中国数字经济与碳排放耦合协调的时空格局',
    type: 'pdf',
    path: 'public/documents/digital-economy-carbon-emissions.pdf',
  },
  {
    slug: 'digital-economy-gtfp',
    title: '数字经济对区域绿色全要素生产率影响的实证分析',
    type: 'docx',
    path: 'public/documents/digital-economy-gtfp.docx',
  },
  {
    slug: 'regional-resilience',
    title: '中国区域韧性时空演变及影响因素',
    type: 'docx',
    path: 'public/documents/regional-resilience.docx',
  },
];

const decodeXml = (value) =>
  value
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
    .replaceAll('&amp;', '&');

const clean = (value) =>
  value
    .replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

async function extractDocx(path) {
  const zip = await JSZip.loadAsync(readFileSync(path));
  const xml = await zip.file('word/document.xml').async('string');
  const text = decodeXml(
    xml
      .replace(/<w:tab\b[^>]*\/>/g, '\t')
      .replace(/<w:br\b[^>]*\/>/g, '\n')
      .replace(/<\/w:p>/g, '\n')
      .replace(/<[^>]+>/g, ''),
  );
  const compact = clean(text);
  const chunks = compact.match(/[\s\S]{1,2400}(?:\s|$)/g) ?? [compact];
  return chunks.map((chunk, index) => ({ part: index + 1, text: clean(chunk) }));
}

const index = [];

for (const document of documents) {
  let sections;
  if (document.type === 'pdf') {
    const text = execFileSync('pdftotext', ['-layout', document.path, '-'], {
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024,
    });
    sections = text.split('\f').filter((page) => page.trim()).map((page, index) => ({
      page: index + 1,
      text: clean(page),
    }));
  } else {
    sections = await extractDocx(document.path);
  }
  index.push({ slug: document.slug, title: document.title, sections });
}

writeFileSync('public/search/index.json', JSON.stringify(index));
