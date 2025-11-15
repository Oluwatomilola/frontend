import { describe, it, expect } from 'vitest';
import { sanitizeMessage, stripAll } from '../sanitize';

describe('sanitizeMessage', () => {
  it('removes script tags', () => {
    const input = "Hello <script>alert('xss')</script> world";
    const out = sanitizeMessage(input);
    expect(out).not.toContain('<script>');
    expect(out).toContain('Hello');
  });

  it('removes onerror handlers', () => {
    const input = "<img src=x onerror=alert('xss') />";
    const out = sanitizeMessage(input);
    expect(out).not.toContain('onerror');
  });

  it('allows basic formatting tags', () => {
    const input = '<b>bold</b> <i>italic</i> <code>code</code>';
    const out = sanitizeMessage(input);
    expect(out).toContain('<b>bold</b>');
    expect(out).toContain('<i>italic</i>');
    expect(out).toContain('<code>code</code>');
  });

  it('adds rel and target to links', () => {
    const input = '<a href="https://example.com">link</a>';
    const out = sanitizeMessage(input);
    expect(out).toContain('rel="noopener noreferrer"');
    expect(out).toContain('target="_blank"');
  });

  it('enforces max length', () => {
    const input = 'a'.repeat(2000);
    const out = sanitizeMessage(input, 1000);
    expect(out.length).toBe(1000);
  });
});

describe('stripAll', () => {
  it('strips all tags', () => {
    const input = "<b>hello</b> <script>alert('x')</script>";
    const out = stripAll(input);
    expect(out).toBe('hello alert(\'x\')');
  });
});
