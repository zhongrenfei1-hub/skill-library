import { useMemo } from 'react';
import { marked } from 'marked';

marked.setOptions({
  gfm: true,
  breaks: false,
  headerIds: false,
  mangle: false,
});

export default function Markdown({ source }) {
  const html = useMemo(() => marked.parse(source || ''), [source]);
  return (
    <article
      className="prose-skill"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
