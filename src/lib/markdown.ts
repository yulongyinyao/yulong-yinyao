import { marked } from 'marked';
import { withBase } from '../consts';

/**
 * Markdown normally treats up to three leading spaces as incidental
 * indentation and throws them away. The author uses indentation to show
 * hierarchy in outlines, so turn it into non-breaking spaces before parsing.
 * Fenced code and real Markdown list/quote syntax are left alone.
 */
function preserveIndent(markdown: string): string {
  let inFence = false;
  let previousBlank = true;

  return markdown
    .split('\n')
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        inFence = !inFence;
        previousBlank = false;
        return line;
      }
      if (inFence) {
        previousBlank = line.trim() === '';
        return line;
      }

      const match = line.match(/^[ \t]+/);
      if (match) {
        const width = match[0].replace(/\t/g, '    ').length;
        const rest = line.slice(match[0].length);
        const isMarkdownSyntax = /^([-*+]|\d+\.)\s/.test(rest) || rest.startsWith('>');
        const isIndentedCode = width >= 4 && previousBlank;
        if (!isMarkdownSyntax && !isIndentedCode) {
          line = '\u00a0'.repeat(width) + rest;
        }
      }

      previousBlank = line.trim() === '';
      return line;
    })
    .join('\n');
}

export function renderMarkdown(markdown: string): string {
  const html = marked.parse(preserveIndent(markdown), {
    async: false,
    gfm: true,
    breaks: false,
  }) as string;

  return html.replace(/(<img\b[^>]*\bsrc=")\/uploads\//g, `$1${withBase('/uploads/')}`);
}
