import { marked } from "marked";

/**
 * Detect if a string looks like Markdown (not HTML).
 * Heuristic: has no block-level HTML tags but has Markdown syntax.
 */
export function looksLikeMarkdown(content: string): boolean {
  if (!content) return false;
  const hasHtmlBlock = /<(p|h[1-6]|ul|ol|li|blockquote|pre|code|strong|em|a)\b/i.test(content);
  if (hasHtmlBlock) return false;
  const hasMarkdown = /^#{1,6}\s|^\*\s|^-\s|^\d+\.\s|\*\*|__|\[.+\]\(.+\)/m.test(content);
  return hasMarkdown;
}

/**
 * Convert Markdown string to HTML.
 * Returns null if conversion fails.
 */
export function markdownToHtml(markdown: string): string | null {
  try {
    const result = marked.parse(markdown, { async: false });
    return result as string;
  } catch {
    return null;
  }
}
