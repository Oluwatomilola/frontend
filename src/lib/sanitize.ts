import DOMPurify, { Config } from 'isomorphic-dompurify';

/**
 * Sanitize user-provided message content to prevent XSS while allowing
 * a minimal set of safe formatting tags.
 */
const config: Config = {
  ALLOWED_TAGS: [
    'b',
    'i',
    'em',
    'strong',
    'a',
    'code',
    'pre',
    'br',
    'p',
    'ul',
    'ol',
    'li',
  ],
  ALLOWED_ATTR: ['href', 'title', 'rel', 'target'],
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
  USE_PROFILES: { html: true },
};

function normalizeLinks(html: string): string {
  // Ensure external links are safe (noopener/noreferrer) and avoid window.opener
  return html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (match, attrs) => {
    let updated = attrs;
    if (!/\brel=/.test(updated)) {
      updated += ' rel="noopener noreferrer"';
    }
    if (!/\btarget=/.test(updated)) {
      updated += ' target="_blank"';
    }
    return `<a ${updated}>`;
  });
}

export function sanitizeMessage(input: string, maxLength = 1000): string {
  const trimmed = (input ?? '').toString().slice(0, maxLength);
  const sanitized = DOMPurify.sanitize(trimmed, config);
  return normalizeLinks(sanitized);
}

export function stripAll(input: string, maxLength = 1000): string {
  const trimmed = (input ?? '').toString().slice(0, maxLength);
  return DOMPurify.sanitize(trimmed, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}
